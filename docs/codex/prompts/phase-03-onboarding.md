# Phase 03: Onboarding

**Branch:** `phase-03-onboarding`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` section 2, `docs/ROADMAP.md` Phase 03.
**Skills:** `shadcn`, `web-design-guidelines`, `next-dev-loop`.

## Goal
A new user answers four quick questions once; the answers are saved and editable later in Settings.

## Tasks

1. **Shared schema:** `src/lib/validation/preferences.ts` (Zod) used by the form and the server action. Diet presets, allergy list, and time options as constants in one file so the plan engine reuses them.

2. **Routing:** after sign-in, if `profiles.onboarding_completed_at` is null, redirect to `/onboarding` (do it in the `(app)` layout or a server helper, not only in the proxy). Completed users visiting `/onboarding` go to `/plan`.

3. **Onboarding UI** (`/onboarding`), one step per screen on mobile:
   1. Days: 3 / 5 / 7 (default 5), start date (default today).
   2. Household: stepper 1 to 6 (default 2), "includes kids" toggle.
   3. Diet: preset chips (multi-select), allergy chips (multi-select), dislikes as free-text tags (type and press Enter; remove with x).
   4. Time: Under 30 / 30 to 45 / Up to 60 minutes on weeknights; separate weekend choice.
   - Progress indicator, Back and Next, defaults preselected, keyboard accessible.
   - Confirmation screen restating choices in one plain sentence (see `PRODUCT.md` example), with "Plan my week" (goes to `/plan`; generation arrives in Phase 04) and "Edit".
   - Show a small note under allergies: "We'll keep these out of every plan. Always check product labels."

4. **Server action** `src/actions/preferences.ts`: validate, upsert `preferences`, set `onboarding_completed_at`.

5. **Settings** (`/settings`): same fields in one form, prefilled, Save with toast. Also show the signed-in email and Sign out.

6. **Tests:** unit test for the Zod schema and the confirmation sentence builder; Playwright test that completes onboarding using the signed-in test user setup from Phase 01.

## Acceptance
`docs/ROADMAP.md` Phase 03 "Done when". Verified at 375px and 1280px.

## Finish
Update `docs/PROGRESS.md`, commit, give manual test steps.
