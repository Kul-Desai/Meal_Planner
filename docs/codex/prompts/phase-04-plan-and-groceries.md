# Phase 04: Plan + groceries

**Branch:** `phase-04-plan-and-groceries`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` sections 5 and 6, `docs/PRODUCT.md` sections 3 to 5, `docs/design/REFERENCES.md` (look at `a-10` to `a-12` for the plan home), `docs/ROADMAP.md` Phase 04.
**Skills:** `vercel-react-best-practices`, `supabase`, `shadcn`, `frontend-design`, `next-dev-loop`.

**How to work:** show a short plan once, then build without stopping for small decisions; record them in `docs/PROGRESS.md`. Build pure logic and tests first, then AI calls, then UI. Stop only for AGENTS.md "Ask before you" items or if blocked.

## Goal
"Plan my week" produces a valid dinner plan that respects every rule; the user can pick proteins, swap any single night, and lock it in; locking creates one combined grocery list they can check off and share.

## Part 1: Rules (pure, tested first)
- `src/lib/plan/diet-rules.ts`: map each diet, each allergy, and each protein the user did not pick to banned ingredient tags and keywords, including derived products (peanut butter, satay, ghee for dairy, fish sauce and Worcestershire for fish, soy sauce for soy and gluten, gelatin for vegetarian, chicken broth for vegetarian).
- `src/lib/plan/constraints.ts`: `checkNight` and `checkPlan` per `ARCHITECTURE.md` section 5 (dates match selected cooking days, allergens, diet, unliked proteins, dislikes, time limits by weekday/weekend, mood tag is one of the user's picks). Case-insensitive, handles plurals.
- About 20 unit tests including the tricky cases above.

## Part 2: AI layer
- Install `ai` and the provider package(s) named in `ARCHITECTURE.md` section 8.
- `src/lib/ai/provider.ts`: model from `AI_PROVIDER` + `AI_MODEL`; `mock` uses fixtures in `src/lib/ai/fixtures/` (a 7-night plan, a few swaps, one deliberately violating a rule).
- `src/lib/ai/schemas.ts` (`PlanDraftSchema`, `NightSchema` with `moodTag`), `prompts.ts` (pure, unit-tested: includes all preferences, cooking days, mood tags spread evenly, liked proteins only, ingredient sharing, allowed units, quantities for household size).
- `generate-plan.ts` and `swap-meal.ts`: `generateText` with `output: Output.object({ schema })`; `checkPlan`; regenerate only failing nights (max 2 retries); then fall back to a passing seed recipe. Log to `ai_generations`; enforce daily limits (10 plans, 30 swaps).

## Part 3: Persistence and actions
- `src/lib/plan/save.ts`: normalize ingredient names to the catalog (exact, alias, simple singularize; create a new ingredient if no match), upsert recipes (dedupe by fingerprint per user), create `meal_plans` (draft) and `plan_meals`.
- `src/actions/plan.ts`: `createDraftPlan`, `swapNight(planId, date, reason, note?)`, `setProteinChoice`, `lockPlan` (also builds the grocery list). A new draft archives the previous draft.

## Part 4: Grocery engine (pure, tested, no AI)
- `src/lib/groceries/units.ts`, `categories.ts`, `aggregate.ts`: flatten planned (not skipped) meals, apply protein choice, normalize units within a family (volume/weight/count, never across), sum by ingredient, friendly US units, round to shopping sizes, sort by store section.
- **Out of scope for now:** leftover subtraction and pantry staples (tables exist; leave them unused).
- About 12 unit tests (duplicates combine, mixed units sum, volume and weight stay separate, protein choice applied, skipped excluded, household scaling, rounding).
- `src/actions/groceries.ts`: `toggleItem` (optimistic), `addManualItem`, `removeItem`, `rebuildList(planId)` after a swap on a locked plan (keeps manual items and check marks on items that still exist).

## Part 5: UI in the reference style
- **Plan home** (`/plan`): greeting ("good morning, {first name}") and plan date range; two summary cards side by side: **Tonight** (meal name and minutes, or "No dinner planned tonight"; tapping does nothing yet, Phase 05 wires it) and **Grocery list** (items bought / total, links to `/groceries`); then the week of night cards: day pill, photo slot with placeholder (rounded square in the mood tag color with the dish's first letter, fixed aspect ratio), title, one-line summary, mood tag chip, minutes, servings, protein choice selector, shared-ingredient chips. Bottom: big pill primary button ("Lock in plan" for drafts, "Draft next week" disabled placeholder for locked plans) with a round filter button that opens preferences in Settings.
- **Empty state:** "Plan my week" button. **Generating:** skeleton cards with plain-language status lines. **Errors:** clear message and retry.
- **Swap a night:** sheet with night (preselected) and reason chips ("I don't like this", "Missing an ingredient", "Need something quicker", free text). Only that night changes. If the reason implies a lasting dislike, offer "Add X to your dislikes?".
- **Meal detail drawer:** ingredients with quantities and steps.
- **Groceries** (`/groceries`): header with counts; sections in store order, collapsible; checked items drop to the bottom with strikethrough; 44px+ rows; add-item input; remove via menu; Copy as text and native share. Empty states: no locked plan (link to `/plan`), all checked ("You're all set").

## Part 6: Tests
Constraint, prompt, and grocery unit tests; integration test of `generate-plan` with mock including a forced violation and retry; Playwright: onboarding done, then plan my week (mock), swap one night, lock in, grocery list appears, check an item, swap again, check mark persists.

## Acceptance
`docs/ROADMAP.md` Phase 04 "Done when". Run once with a real provider key (I will add it to `.env.local`) and paste one generated plan and its grocery list into `PROGRESS.md` for review, with model, generation time, and tokens.

## Finish
Update `docs/PROGRESS.md`, commit, open the PR, list manual test steps.
