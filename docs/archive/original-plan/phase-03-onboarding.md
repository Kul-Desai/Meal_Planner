> **Superseded by the lean plan (2026-10-26).** Kept for reference only. Do not execute.

# Phase 03: Onboarding

**Branch:** `phase-03-onboarding`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` section 2, `docs/ROADMAP.md` Phase 03.
**Skills:** `shadcn`, `web-design-guidelines`, `next-dev-loop`.

## Goal
A new user taps through eight quick questions once; the answers are saved and editable later in Settings. Flow, options, and order are in `docs/PRODUCT.md` section 2 and `docs/design/REFERENCES.md` (look at the `a-01` to `a-08` screenshots for the interaction pattern; keep shadcn default styling until Phase 08).

## Tasks

1. **Shared schema:** `src/lib/validation/preferences.ts` (Zod) used by the form and the server action. Mood tags, diets, allergies, proteins, common dislikes, and time options as constants in one file (`src/config/preferences.ts`) with labels and emoji, so the plan engine and Settings reuse them.

2. **Routing:** after sign-in, if `profiles.onboarding_completed_at` is null, redirect to `/onboarding` (do it in the `(app)` layout or a server helper, not only in the proxy). Completed users visiting `/onboarding` go to `/plan`.

3. **Onboarding UI** (`/onboarding`), one question per screen on all sizes:
   1. Mood: tile grid, pick up to 3 (block a 4th with a gentle message).
   2. Cooking days: M to S toggles (default Mon to Fri), at least 1.
   3. Household: big number with minus/plus (1 to 6, default 2), "includes kids" toggle.
   4. Diet: single choice tiles (None, Vegetarian, Vegan, Pescatarian).
   5. Allergies: multi-select tiles with None (None clears the others).
   6. Proteins: multi-select tiles; hide options that conflict with the diet; at least 1.
   7. Dislikes: text input with add button, plus common-pick chips; removable tags.
   8. Time: Under 30 / 30 to 45 / Up to 60 minutes on weeknights; separate weekend choice.
   - Top bar: back arrow and progress bar. Full-width Continue button pinned at the bottom, disabled until the step is valid. Keyboard accessible; tiles are real buttons with `aria-pressed`.
   - Keep answers in client state across steps; save once at the end (and offer resume if the user leaves mid-way, using a draft saved in `sessionStorage`).
   - Summary screen ("Your plan is ready to build") restating choices in one plain sentence (see `PRODUCT.md` example), with "Plan my week" (goes to `/plan`; generation arrives in Phase 04) and "Edit answers".
   - Small note under allergies: "We'll keep these out of every plan. Always check product labels."

4. **Server action** `src/actions/preferences.ts`: validate, upsert `preferences`, set `onboarding_completed_at`.

5. **Settings** (`/settings`): same fields grouped in sections on one page, prefilled, Save with toast. Also show the signed-in email and Sign out.

6. **Tests:** unit tests for the Zod schema (max 3 moods, at least 1 day, at least 1 protein, diet/protein conflicts) and the summary sentence builder; Playwright test that completes onboarding using the signed-in test user setup from Phase 01.

## Acceptance
`docs/ROADMAP.md` Phase 03 "Done when". Verified at 375px and 1280px.

## Finish
Update `docs/PROGRESS.md`, commit, give manual test steps.
