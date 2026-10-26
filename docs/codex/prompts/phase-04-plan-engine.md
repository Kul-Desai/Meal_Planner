# Phase 04: Plan engine

**Branch:** `phase-04-plan-engine`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` section 5 (all of it), `docs/PRODUCT.md` sections 3 and 4, `docs/ROADMAP.md` Phase 04.
**Skills:** `vercel-react-best-practices`, `supabase`, `shadcn`, `next-dev-loop`.

This is the heart of the app. Build the pure logic and its tests first, then the AI calls, then the UI.

## Goal
The user clicks "Plan my week" and gets a valid draft that respects every rule, can swap any single night, and can lock the plan in.

## Tasks (in this order)

1. **Rules (pure, test first)**
   - `src/lib/plan/diet-rules.ts`: map each diet, each allergy, and each protein (for proteins the user did not pick) to banned ingredient tags and keywords (include derived products: peanut butter, ghee for dairy, fish sauce for fish, Worcestershire for fish, soy sauce for soy and gluten, gelatin for pork/vegetarian, etc.).
   - `src/lib/plan/constraints.ts`: `checkNight(night, prefs) -> Violation[]` and `checkPlan(plan, request) -> { ok, violationsByDate }`. Rules in `ARCHITECTURE.md` section 5. Matching is case-insensitive and handles plurals.
   - Unit tests: at least 25 cases, including tricky ones (vegetarian + "chicken broth", peanut allergy + "satay sauce", pork not liked + "bacon bits", night on a non-cooking day, dislike "mushroom" vs "mushrooms", weekend time limit on Saturday).

2. **AI layer**
   - Install `ai`, `zod` (if not present), and the provider package(s) for the providers in `ARCHITECTURE.md` section 8.
   - `src/lib/ai/provider.ts`: returns a model from `AI_PROVIDER` + `AI_MODEL`; `mock` returns a fake implementation backed by fixtures in `src/lib/ai/fixtures/` (a 7-night plan and several single-night swaps, including one that violates a rule so retry logic is testable).
   - `src/lib/ai/schemas.ts`: `PlanDraftSchema`, `NightSchema` per section 5, with `.describe()` hints for the model.
   - `src/lib/ai/prompts.ts`: pure prompt builders. The system prompt asks for one night per selected cooking day, each night tagged with one of the user's mood tags (spread evenly), only liked proteins, nights that share ingredients, realistic weeknight cooking, quantities scaled to household size, allowed units only, protein options where natural, and a planned leftover when it saves effort (cook extra rice Monday for Thursday fried rice). Unit-test that prompts include all preferences, loved meals, and "not again" exclusions.
   - `src/lib/ai/generate-plan.ts` and `swap-meal.ts`: `generateText` with `output: Output.object({ schema })`. Validate with `checkPlan`; regenerate only failing nights (max 2 retries); then fall back to a passing seed recipe. Log to `ai_generations`; enforce daily limits (10 plans, 30 swaps).

3. **Persistence**
   - `src/lib/plan/save.ts`: normalize ingredient names to the catalog (exact, alias, simple singularize; create a new ingredient with category from the model if no match); upsert recipes (dedupe by fingerprint per user); create `meal_plans` (status draft) and `plan_meals`.
   - Server actions in `src/actions/plan.ts`: `createDraftPlan`, `swapNight(planId, date, reason, note?)`, `setProteinChoice`, `lockPlan`. Only one non-archived draft or locked plan per overlapping date range: creating a new one archives the old draft.

4. **UI** (`/plan`)
   - No plan: empty state with "Plan my week".
   - Generating: progress state with skeleton nights and rotating plain-language status ("Checking your rules", "Sharing ingredients across nights"). Handle errors with a retry button and a clear message.
   - Draft: this is the home screen. Header with greeting ("Good morning, Chef KD"; first name from profile, fallback to email name) and plan range; Tonight card placeholder and Grocery card placeholder side by side (wired in Phases 05 and 06); list of night cards (day pill, photo slot showing the placeholder until Phase 04b, title, summary, mood tag badge, minutes, servings, shared-ingredient chips, protein choice selector); shared ingredients summary; note line.
   - "Swap a night": opens a sheet; pick night (preselected if opened from a night) and reason chips; free text optional. Only that night animates to the replacement. If the reason implies a lasting dislike, offer "Add X to your dislikes?".
   - "Lock in plan" with confirmation toast; locked plans show a "Locked" badge (grocery list arrives in Phase 05).
   - Meal detail drawer: ingredients with quantities and steps.

5. **Tests:** constraint and prompt unit tests; an integration test of `generate-plan` with the mock provider including a forced violation and retry; Playwright: onboarding -> plan my week (mock) -> swap Wednesday -> lock in.

## Acceptance
`docs/ROADMAP.md` Phase 04 "Done when". Run once with a real provider key (I will add it to `.env.local`) and paste one generated plan into `PROGRESS.md` for review.

## Finish
Update `docs/PROGRESS.md` with model used, average generation time, and token usage per plan. Commit. Manual test steps.
