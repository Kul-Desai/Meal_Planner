# Progress Log

Codex updates this file at the end of every phase. Newest entry on top. Claude reviews it when you say "review phase XX".

## Current status

- Current phase: **02 Database and security** (ready for review)
- Last merged phase: **01 Foundation and auth** (2026-10-26)
- Blockers: none

## Human to-do (keys, dashboards, decisions)

- [x] Phase 00 checklist in `docs/README.md`
- [ ] Phase 01: Google OAuth client. In Google Cloud Console, create or select a project; configure the OAuth consent screen with app name and support email; add `openid`, email, and profile scopes; create a Web application client; add `http://localhost:3000` and `https://meal-planner-kd.vercel.app` as Authorized JavaScript origins; copy the callback URL from Supabase Dashboard > Authentication > Providers > Google into Authorized redirect URIs; then paste the Google client ID and client secret into that Supabase provider and enable it.
- [ ] Phase 01: add Vercel preview URL pattern to Supabase Redirect URLs after the first PR
- [ ] Before public launch (Phase 10): custom SMTP (Resend + domain) in Supabase; until then sign-in emails reach only Supabase org members and templates cannot be edited (free projects created after 2026-06-03)

## Decisions log

| Date | Decision | Why |
|------|----------|-----|
| 2026-10-26 | Next.js 16 + Tailwind v4 + shadcn/ui + Supabase (`@supabase/ssr`) | One codebase for web and installable PWA |
| 2026-10-26 | Vercel AI SDK v7 with structured output and a mock provider | Provider-agnostic; app works without keys in dev and CI |
| 2026-10-26 | Grocery math and allergy checks in code, never in the LLM | Correctness and safety |
| 2026-10-26 | PWA first, iOS later (optional) | Least extra work; keeps server features |
| 2026-10-26 | Google Play listing dropped | Not worth the $25 fee and 14-day closed test right now; Android users install the PWA from the website |
| 2026-10-26 | AI-generated meal photos, cached per dish in ImageKit (Phase 04b) | Photos are central to the reference design; cache keeps cost tied to distinct dishes |
| 2026-10-26 | Design direction from App A references (see `docs/design/REFERENCES.md`); keep its playful, light lime green theme | Playful tap-through onboarding, photo meal cards, Plan as home |
| 2026-10-26 | Onboarding expanded to 8 questions: mood tags, exact cooking days, proteins liked added | Better-fitting plans; proteins replace "no pork / no beef" presets |
| 2026-10-26 | Budget and cost per meal deferred | No reliable price data yet; keeps MVP focused |
| 2026-10-26 | App is free; no trial or payments | Validate usefulness first |
| 2026-10-26 | Skip health questions (sex, weight, activity, medical) | Out of scope; avoids storing health data |
| 2026-10-26 | Nav: Plan (home), Groceries, Meals, Settings; Tonight is a card on Plan | Matches reference layout |
| 2026-10-26 | Lean plan: Phases 03 Onboarding, 04 Plan + groceries, 05 Week + learning = MVP; photos, PWA/reminders, design polish, launch moved to Later; leftovers, pantry, cook mode, auto-draft deferred | Faster path to a usable app |
| 2026-10-26 | Design as you build (no separate design phase); Codex plans once then builds, Claude reviews at phase end | Fewer rounds and stops |

## Phase entries

### Phase 02: Database and security (2026-10-26)
**Branch:** `phase-02-database`
**Built:** Development schema with 13 RLS-protected tables, six stable-status enums, text/check-constrained evolving vocabularies, `updated_at` triggers, ownership and foreign-key indexes, and a security-definer Auth sign-up trigger. Composite owner foreign keys prevent cross-user attachment for plans, lists, grocery items, and feedback; recipe references are separately restricted to global or owned recipes. Seeded 150 global ingredients and 30 global recipes. Generated typed Supabase database types and table helpers, and added a project-ref-based pgTAP script.
**Files touched (main ones):** `supabase/migrations/`, `supabase/seed.sql`, `supabase/tests/rls_user_isolation.sql`, `src/lib/supabase/database.types.ts`, `src/lib/supabase/types.ts`, Supabase client helpers, `package.json`.
**New dependencies:** none.
**Decisions:** User-owned child tables use composite foreign keys with the owner ID, in addition to owner RLS, as defense in depth. `meal_feedback` uses `(plan_meal_id, user_id)` only so swapping a meal does not invalidate existing feedback; its `recipe_id` remains a normal FK and is policy-checked. `ai_generations` is append-only for signed-in users' own non-null-user rows; null-user system rows are service-role-only for the Phase 04b image pipeline. The `rls_auto_enable()` event-trigger function and sign-up trigger are not executable by `PUBLIC`, `anon`, or `authenticated`.
**Verification:** `npm run db:test` passed 55 pgTAP assertions in a transaction and rolled back; it covers user A's read/insert/update/delete isolation from user B across every user-owned table, all cross-owner parent attachments, private-recipe attachment, ingredient writes, and null-user generation logs. Persisted dev seed verified at 150 ingredients and 30 global recipes with zero retained test users. Supabase security advisor reports only the accepted Auth-dashboard leaked-password warning. Performance advisor reports no missing foreign-key indexes; its remaining unused-index notices are expected immediately after schema creation.
**Known issues / follow-ups:** Leaked-password protection is disabled in Supabase Auth. This is an accepted non-blocking dashboard warning because Phase 01 uses email links and Google sign-in; enable it when the plan/tier supports it. `db:test` intentionally targets the connected development project and must never be pointed at production.
**Manual test steps:**
1. Run `npm run db:test`; confirm the command exits successfully and reports the final pgTAP assertion (`ok 55`).
2. In Supabase Studio for the development project, verify the ingredient count is 150 and the global-recipe count is 30.
3. In the Auth dashboard, review the leaked-password-protection warning and leave it documented as accepted for the passwordless Phase 01 flow.

### Phase 01: Foundation and auth (2026-10-26)
**Branch:** `phase-01-foundation`
**Built:** Supabase SSR browser, server, and Next.js 16 proxy clients; email magic-link, Google OAuth, callback code exchange, token-hash confirmation, and sign-out flows; public landing, login, privacy, and terms routes; protected Plan, Today, Groceries, Meals, and Settings placeholders; responsive shell with the four approved nav items only (Today is protected but not navigated); shadcn/Radix primitives, responsive lime token theme, Prettier, Vitest, Playwright, and GitHub Actions CI.
**Files touched (main ones):** `src/lib/supabase/`, `src/actions/auth.ts`, `src/app/(app)/`, `tests/`, `.github/workflows/ci.yml`.
**New dependencies:** `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `server-only`, shadcn/Radix dependencies, Prettier plus Tailwind plugin, Vitest, Playwright, `@next/env`, Supabase CLI.
**Decisions:** Email uses Supabase's default PKCE magic-link flow to `/auth/callback?code=...`; `/auth/complete` safely handles the default-template fragment fallback; `/auth/confirm` is ready for the Phase 10 custom token-hash template. Auth redirect URLs derive from the requesting browser's origin (then trusted forwarded host/protocol) so PKCE stays on the same host; `NEXT_PUBLIC_SITE_URL` is only the no-header fallback. Per-user leaves explicitly call `connection()` inside Suspense so Next.js streams the static shell and does not prerender Supabase's time-dependent session validation. Playwright creates a password-based dev-only account only when dev credentials are present; the current signed-out redirect spec always runs.
**Known issues / follow-ups:** The default Supabase sender only sends to organization members and permits two emails per hour. Test the live magic link with an organization-member inbox; the callback exchange and fragment fallback are implemented, but no inbox is available to automate that final click here. `npm run db:types` is implemented but requires a local Supabase CLI login or `SUPABASE_ACCESS_TOKEN`; no database schema exists until Phase 02. Google sign-in requires the dashboard setup above.
**Manual test steps:**
1. Run `npm run dev` and open `http://localhost:3000`; confirm the landing page's Get started button opens login.
2. Use an organization-member email to request a magic link, then open it in the same browser; confirm it redirects to `/plan` and remains signed in after refresh.
3. Open the link in a different browser; confirm login explains the PKCE limitation and offers a new link.
4. After completing Google OAuth setup, select Continue with Google and confirm the callback lands on `/plan`.
5. At 375px, confirm the bottom nav contains Plan, Groceries, Meals, Settings; at 1280px, confirm those same items appear in the sidebar; `/today` is reachable directly but does not appear in navigation.
6. Open the account menu and select Sign out; confirm a visit to `/plan` returns to `/login`.

### Phase 00: Setup (2026-10-26)
**Built:** Next.js 16.4.3 + React 19.3 scaffold (`src/`, Tailwind v4, ESLint, React Compiler, Cache Components, Partial Prefetching); root `AGENTS.md` with project rules; 7 skills in `.agents/skills` (`skills-lock.json`); `agent-browser` 0.27.3.
**Services:** GitHub `Kul-Desai/Meal_Planner`; Supabase dev project `meal-planner-dev` (ref `ptvdczmwkwqkxlintzri`) connected to Codex MCP (database, docs, development, debugging); Vercel project `chef_meal_planner` live at https://meal-planner-kd.vercel.app (env vars set: `NEXT_PUBLIC_*` as Config, `SUPABASE_SECRET_KEY` as Secret).
**Supabase auth URLs:** Site URL `http://localhost:3000`; redirects `http://localhost:3000/**`, `https://meal-planner-kd.vercel.app/**`.
**Known gaps:** no `typecheck`/`test` scripts yet (Phase 01).

<!-- Template for Codex:
### Phase XX: Name (YYYY-MM-DD)
**Branch:** phase-XX-name  |  **PR:** #
**Built:**
-
**Files touched (main ones):**
-
**New dependencies:**
- package: reason
**Decisions:**
-
**Known issues / follow-ups:**
-
**Human must do:**
-
**Manual test steps:**
1.
-->
