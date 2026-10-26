# Architecture

This is the technical source of truth. If code and this file disagree, fix one of them in the same PR and note it in `docs/PROGRESS.md`.

## 1. Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router, TypeScript strict, Turbopack, React Compiler on) | One codebase for web, installable app, and store wrappers |
| Styling | Tailwind CSS v4 + shadcn/ui | Accessible components we own as source; easy to reskin in the design phase |
| Auth + DB | Supabase (Postgres, Auth, Storage, Cron) via `@supabase/ssr` | Auth, Row Level Security, and scheduled jobs in one place |
| Validation | Zod | One schema for forms, server actions, and AI output |
| AI | Vercel AI SDK v7 (`ai` package) with structured output (`generateText` + `Output.object`) | Provider-agnostic; swap OpenAI / Anthropic / Gateway by env var |
| Email | Resend (later phase) | Reminders and "next week's plan is ready" |
| Push | Web Push (`web-push`) from the PWA | Works on Android, desktop, and installed iOS web apps |
| Media | None in MVP; ImageKit when photos arrive (see section 9) | Free tier covers early usage |
| Tests | Vitest (unit), Playwright (end-to-end) | Grocery math and constraint checks must be unit tested |
| Hosting | Vercel (web), Supabase cloud (DB) | Git push to deploy; preview URL per PR |
| Analytics / errors | PostHog, Sentry (launch phase) | Know where users drop off and what breaks |

Node.js 22 or newer is required (AI SDK v7 needs it).

## 2. Folder structure

```
src/
  app/
    (marketing)/            # public landing page, privacy, terms
      page.tsx
    (auth)/
      login/page.tsx
      auth/callback/route.ts   # OAuth / magic link code exchange
      auth/confirm/route.ts    # email OTP verification
    (app)/                   # signed-in area, shared app shell
      layout.tsx             # bottom nav on mobile, sidebar on desktop
      onboarding/page.tsx
      today/page.tsx         # tonight's dinner (home during an active week)
      plan/page.tsx          # current plan (draft or locked)
      plan/[planId]/page.tsx # past plans
      groceries/page.tsx
      favorites/page.tsx
      settings/page.tsx
    api/
      cron/weekly-draft/route.ts   # scheduled job entry point (secured)
    manifest.ts              # PWA manifest (PWA phase)
  components/
    ui/                      # shadcn components (generated, lightly edited)
    plan/ groceries/ onboarding/ layout/
  lib/
    supabase/
      client.ts              # createBrowserClient
      server.ts              # createServerClient with await cookies()
      proxy.ts               # session refresh helper used by src/proxy.ts
      admin.ts               # secret-key client, server-only, used by cron only
    ai/
      provider.ts            # picks model from env; "mock" provider for dev/tests
      schemas.ts             # Zod schemas for AI output
      prompts.ts             # prompt builders (pure functions)
      generate-plan.ts       # full week
      swap-meal.ts           # one night
    plan/
      constraints.ts         # hard rule checks (allergens, diet, time, day count)
      diet-rules.ts          # diet flag -> banned ingredient keywords
      context.ts             # builds AI context from prefs + feedback + history
    groceries/
      aggregate.ts           # pure function: meals -> grocery items
      units.ts               # unit normalization and conversion
      categories.ts          # ingredient -> store section
    validation/              # shared Zod schemas for forms and actions
    env.ts                   # Zod-validated environment variables
  actions/                   # server actions grouped by feature
  config/site.ts             # app name, URLs, constants
  proxy.ts                   # Next.js 16 proxy (formerly middleware)
supabase/
  migrations/                # SQL migrations, committed to git
  seed.sql                   # seed recipes + ingredient catalog
  tests/                     # RLS tests (pgTAP or SQL assertions)
tests/
  unit/                      # Vitest
  e2e/                       # Playwright
docs/                        # this playbook
```

## 3. Supabase auth rules

- Packages: `@supabase/supabase-js` and `@supabase/ssr` only. Never `@supabase/auth-helpers-nextjs` (deprecated).
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Secret key (`SUPABASE_SECRET_KEY`) is server-only and used only by cron/admin code.
- Cookies: use only `getAll` and `setAll`. Never `get`, `set`, `remove`.
- `src/proxy.ts` exports `proxy` and refreshes the session on every request. Unauthenticated users hitting `(app)` routes redirect to `/login`.
- On the server, authorize with `supabase.auth.getUser()` (or `getClaims()`), never by trusting `getSession()` alone.
- Every server action re-checks the user. Do not rely on the proxy for authorization.

## 4. Data model

All tables have `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, and RLS enabled. User-owned tables have `user_id uuid references auth.users on delete cascade` with policies restricting all operations to `auth.uid() = user_id`.

```
profiles                 1:1 with auth.users (created by trigger on sign-up)
  user_id, display_name, timezone, onboarding_completed_at

preferences              1:1 with user
  user_id, plan_days (3|5|7), week_start_day (0-6), household_size (1-6),
  has_kids bool, diet_flags text[], allergies text[], dislikes text[],
  max_minutes_weekday int, max_minutes_weekend int,
  auto_draft bool, auto_draft_day int, reminder_time time null, updated_at

ingredients              shared catalog (read-only to users)
  name (canonical, unique), aliases text[], category (store section),
  default_unit, allergens text[], diet_tags text[] (meat, pork, beef, poultry,
  fish, shellfish, dairy, egg, gluten, ...)

recipes                  AI-generated or seeded; owned by user or global
  user_id null (null = global seed), title, summary, minutes, base_servings,
  cuisine, tags text[], steps jsonb (array of strings), protein_options text[],
  source ('seed'|'ai'), image_url null, fingerprint (normalized title for dedupe)

recipe_ingredients
  recipe_id, ingredient_id, quantity numeric, unit, note, optional bool

meal_plans
  user_id, start_date, days int, status ('draft'|'locked'|'archived'),
  household_size int (snapshot), summary text, locked_at

plan_meals
  plan_id, user_id, date, slot ('dinner'), recipe_id, servings,
  protein_choice text null, status ('planned'|'cooked'|'skipped'),
  makes_leftover jsonb null   -- {ingredient_id, quantity, unit}
  uses_leftover jsonb null

grocery_lists
  user_id, plan_id unique, created_at, updated_at

grocery_items
  list_id, user_id, ingredient_id null, display_name, quantity numeric null,
  unit null, category, checked bool, source ('plan'|'manual'),
  have_at_home bool

pantry_items             things the user usually has (salt, oil, rice ...)
  user_id, ingredient_id, always_have bool

meal_feedback
  user_id, recipe_id, plan_meal_id, rating ('loved'|'fine'|'not_again'), note

ai_generations           usage log + rate limiting
  user_id, kind ('plan'|'swap'), model, input_tokens, output_tokens,
  duration_ms, ok bool, error text null
```

Indexes: foreign keys, `(user_id, start_date)` on `meal_plans`, `(plan_id, date)` on `plan_meals`, `(user_id, created_at)` on `ai_generations`, GIN on `ingredients.aliases`.

## 5. Plan engine (AI pipeline)

The model is creative; code is the guardrail. The LLM never has the final word on safety or arithmetic.

```
            preferences + feedback + recent meals + pantry
                              |
                       lib/plan/context.ts
                              |
                lib/ai/prompts.ts  (pure, unit-tested)
                              |
     generateText({ model, output: Output.object({ schema: PlanDraftSchema }) })
                              |
                lib/plan/constraints.ts   <-- hard checks
                 |                    |
              passes               fails on night N
                 |                    |
                 |       regenerate only night N (max 2 retries)
                 |                    |
                 |         still failing -> pick a seed recipe that passes
                 |                    |
          normalize ingredients to catalog (match name/aliases; create if new)
                              |
                save draft: meal_plans + recipes + plan_meals
```

### PlanDraftSchema (shape, defined in `lib/ai/schemas.ts`)

```ts
{
  nights: Array<{
    date: string;                 // ISO date
    title: string;                // "Chicken stir-fry"
    summary: string;              // one line
    minutes: number;
    proteinOptions?: string[];    // ["chicken", "tofu", "paneer"]
    ingredients: Array<{ name: string; quantity: number; unit: string; category: string }>;
    steps: string[];              // 3-8 short steps
    makesLeftover?: { name: string; quantity: number; unit: string };
    usesLeftover?: { name: string; quantity: number; unit: string };
  }>;
  sharedIngredients: string[];
  note: string;                   // "No pork or beef anywhere ..."
}
```

Quantities in AI output are for the household size requested. Units must come from the allowed list in `lib/groceries/units.ts`.

### Hard constraints (`lib/plan/constraints.ts`)
- Night count and dates match the request exactly.
- No ingredient matches an allergy (check catalog `allergens`, plus keyword list including derived products, for example peanut -> peanut butter, peanut oil, satay).
- No ingredient violates a diet flag (`diet-rules.ts` maps flags to banned tags and keywords, for example "no pork" -> pork, bacon, ham, prosciutto, pancetta, chorizo, lard, pepperoni).
- No ingredient matches a dislike (case-insensitive, singular/plural).
- `minutes` within the weekday or weekend limit.
- No recipe the user rated "not_again"; no exact repeat of last week's meals unless "loved".

### Swap one night (`lib/ai/swap-meal.ts`)
Input: plan id, date, reason, optional free text. The prompt includes the other nights' ingredients and asks for maximum overlap. Same validation path. If the plan is locked, the grocery list is recomputed and manual items and check marks are preserved.

### Learning
`context.ts` passes up to 10 "loved" recipes (titles + key ingredients), all "not_again" titles, and the last 2 weeks of meals to avoid repeats. Later upgrade: pgvector embeddings to find similar liked meals.

### Cost and safety controls
- Model ID from env (`AI_MODEL`), default a fast, inexpensive model. `AI_PROVIDER=mock` returns fixture plans so the whole app works with no API key and in tests.
- Rate limit per user: 10 plan generations and 30 swaps per day, enforced by counting `ai_generations` rows.
- Generation runs in a server action with streaming progress UI; timeout and friendly retry message.

## 6. Grocery engine (`lib/groceries/aggregate.ts`)

Pure function, no AI, heavily unit-tested.

```
aggregate(meals, { pantry, haveAtHome }) -> GroceryItem[]
```

1. Flatten all ingredients of all planned (not skipped) meals; apply the chosen protein option.
2. Normalize units: volume to ml, weight to g, count stays count. Known conversions only; never guess a density.
3. Group by `ingredient_id` + unit family; sum quantities.
4. Subtract leftovers: if night A `makesLeftover` X and night B `usesLeftover` X, B's X is not purchased (A's recipe already includes the extra).
5. Drop pantry `always_have` items into a collapsed "Check you have" group instead of the main list.
6. Convert back to friendly units (for example 900 g chicken -> "about 2 lb" for US locale), round up to sensible shopping sizes.
7. Sort by category order: Produce, Protein, Dairy and eggs, Bakery, Pantry, Frozen, Other.

## 7. Routes and screens

| Route | Purpose |
|-------|---------|
| `/` | Landing page (signed out) or redirect to `/today` |
| `/login` | Email + Google sign in |
| `/onboarding` | Four questions |
| `/plan` | Current draft or locked plan; swap, lock in |
| `/groceries` | Grocery list for the current plan |
| `/today` | Tonight's dinner, prep steps, swap tonight, leftovers tip |
| `/favorites` | Loved meals and "not again" list |
| `/settings` | Preferences, reminders, pantry staples, export data, delete account |
| `/privacy`, `/terms` | Required for app stores |

## 8. Environment variables

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=            # server only; cron/admin only
AI_PROVIDER=mock                # mock | openai | anthropic | gateway
AI_MODEL=                       # e.g. a small fast model id for the chosen provider
OPENAI_API_KEY=                 # only if AI_PROVIDER=openai
ANTHROPIC_API_KEY=              # only if AI_PROVIDER=anthropic
AI_GATEWAY_API_KEY=             # only if AI_PROVIDER=gateway
CRON_SECRET=                    # protects /api/cron/*
RESEND_API_KEY=                 # reminders phase
VAPID_PUBLIC_KEY= / VAPID_PRIVATE_KEY=   # push phase
```

`src/lib/env.ts` validates these with Zod at startup and fails loudly with a clear message.

## 9. Media strategy

| Option | Use it for | Cost notes (verify before committing) |
|--------|-----------|------------|
| No photos (typographic / illustrated meal cards) | MVP | Free; fastest; avoids wrong-looking AI food photos |
| ImageKit | User-uploaded recipe photos, CDN resizing, app-store screenshots | Free tier listed at 20 GB bandwidth, 3 GB storage per month as of March 2026 |
| Supabase Storage | Raw file storage next to your data with the same RLS | Storage on free plan; image transformations require the Pro plan (100 origin images included, then $5 per 1,000) |
| Stock photo API (Unsplash / Pexels) | Generic food imagery for seed recipes | Free with attribution rules |
| AI-generated images | Hero/marketing art only | Per-image cost; inconsistent for recipes |

Recommendation: ship MVP with no recipe photos and a strong typographic card design. Add ImageKit when user photo upload becomes a feature.

## 10. Other services worth adding (in this order)

1. **Resend**: reminder and weekly-draft emails (simplest reliable reminder channel).
2. **Sentry**: error monitoring from day one of public use.
3. **PostHog**: product analytics and funnels (onboarding -> locked plan -> second week).
4. **USDA FoodData Central** (free) or Edamam: nutrition info, later.
5. **Grocery delivery handoff** (Instacart-style shopping list links): later, after validating demand.
