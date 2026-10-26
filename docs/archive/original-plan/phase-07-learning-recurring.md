> **Superseded by the lean plan (2026-10-26).** Kept for reference only. Do not execute.

# Phase 07: Learning and recurring plans

**Branch:** `phase-07-learning-recurring`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` sections 7 and 8, `docs/ARCHITECTURE.md` section 5 "Learning", `docs/ROADMAP.md` Phase 07.
**Skills:** `supabase`, `supabase-postgres-best-practices` (for the cron job), `shadcn`, `next-dev-loop`.

## Goal
The app remembers what worked. Next week's plan starts closer to what the user likes, and can draft itself.

## Tasks

1. **Feedback**
   - On `/today` and `/plan`, past meals without feedback show a one-tap prompt: Loved it / It was fine / Not again (optional note).
   - `src/actions/feedback.ts`: upsert `meal_feedback`.
   - "Not again" asks: "Is there an ingredient you want to avoid?" and offers to add it to dislikes.

2. **Meals tab** (`/meals`)
   - Loved meals (tap to view recipe, "Add to next week"), "Not again" list (with Undo), and past meals by week.

3. **Context for planning** (`src/lib/plan/context.ts`)
   - Up to 10 loved recipes (most recent first), all "not again" titles, last 14 days of meals to avoid repeats, pinned "add to next week" meals.
   - Unit tests prove exclusions and inclusions reach the prompt and that constraints still reject "not again" recipes even if the model returns them.

4. **Draft next week**
   - Button on `/plan` and on `/today` when the plan is ending: creates a draft starting the day after the current plan ends, with saved preferences, no questions asked.

5. **Weekly auto-draft**
   - Settings: "Draft my next plan automatically" with day of week.
   - Route `src/app/api/cron/weekly-draft/route.ts` protected by `Authorization: Bearer ${CRON_SECRET}`; finds opted-in users whose day is today (their timezone) and who have no upcoming draft; drafts plans using the admin client; logs results.
   - Schedule it with Vercel Cron (`vercel.json`) daily; document in `PROGRESS.md`. (Supabase `pg_cron` + `pg_net` calling the route is the alternative; explain the trade-off briefly.)
   - Notification is a placeholder log line until Phase 09.

6. **Tests:** context unit tests; route test for auth rejection; Playwright: give feedback -> appears on the Meals tab.

## Acceptance
`docs/ROADMAP.md` Phase 07 "Done when". This completes the MVP.

## Finish
Update `docs/PROGRESS.md` with an "MVP complete" summary: what works, known gaps, and suggested fixes before the design pass. Commit. Manual test steps.
