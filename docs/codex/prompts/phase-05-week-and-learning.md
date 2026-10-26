# Phase 05: Week + learning

**Branch:** `phase-05-week-and-learning`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` sections 6 to 8, `docs/ARCHITECTURE.md` section 5 "Learning", `docs/ROADMAP.md` Phase 05.
**Skills:** `supabase`, `shadcn`, `frontend-design`, `next-dev-loop`.

**How to work:** show a short plan once, then build without stopping for small decisions; record them in `docs/PROGRESS.md`. Stop only for AGENTS.md "Ask before you" items or if blocked.

## Goal
During the week the app answers "what's for dinner tonight?", adapts when plans change, collects quick feedback, and drafts next week from what the user liked.

## Tasks

1. **Tonight card and Tonight view**
   - Wire the Tonight card on `/plan`: meal name, mood tag, minutes, "Start cooking" opens `/today`.
   - `/today`: meal title, minutes, servings, protein choice, ingredients checklist, numbered steps in large readable type, tomorrow preview line. States: no plan, plan not locked, plan ended, tonight skipped.
   - "Tonight" uses the user's timezone from `profiles` (pure helper, unit-tested).

2. **Change tonight** (`src/actions/today.ts`)
   - `markCooked`, `markSkipped`.
   - `swapTonight(reason)`: "Missing an ingredient" (ask which; exclude it), "Need something quicker" (lower time limit for this swap), "Skip tonight". Reuse `swapNight` from Phase 04 and call `rebuildList` when the list exists.

3. **Feedback**
   - Past meals without feedback show a one-tap prompt on `/plan` and `/today`: Loved it / It was fine / Not again (optional note).
   - `src/actions/feedback.ts`: upsert `meal_feedback`. "Not again" offers "Avoid an ingredient?" to add a dislike.

4. **Meals tab** (`/meals`): loved meals (view recipe, "Add to next week"), "Not again" list with Undo, past meals grouped by week.

5. **Learning context** (`src/lib/plan/context.ts`): up to 10 loved recipes, all "not again" titles, last 14 days of meals (avoid repeats), meals pinned with "Add to next week". Unit tests prove exclusions and inclusions reach the prompt, and that constraints reject a "not again" recipe even if the model returns it.

6. **Draft next week:** enable the button on `/plan` (and on `/today` when the plan is ending). It creates a draft starting on the next cooking day after the current plan ends, using saved preferences and the learning context, no questions asked.

7. **Out of scope for now:** leftovers helper, cook mode, weekly auto-draft cron, reminders.

8. **Tests:** unit tests for timezone and context; Playwright: lock plan, open Tonight, swap tonight, give feedback, see it on the Meals tab, draft next week.

## Acceptance
`docs/ROADMAP.md` Phase 05 "Done when". This completes the MVP.

## Finish
Update `docs/PROGRESS.md` with an "MVP complete" summary (what works, known gaps, suggested next steps from the Later list), commit, open the PR, list manual test steps.
