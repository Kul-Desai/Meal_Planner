# Phase 03: Onboarding (designed in the reference style)

**Branch:** `phase-03-onboarding`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` section 2, `docs/design/REFERENCES.md`, `docs/DESIGN.md` (Brief and theme), `docs/ROADMAP.md` Phase 03. Look at `docs/design/references/a-01` to `a-08` (quiz pattern) and `b-09` (summary screen).
**Skills:** `frontend-design`, `shadcn`, `web-design-guidelines`, `next-dev-loop`.

**How to work:** show a short plan once (files, components, any data-model gaps), then build without stopping for small decisions. Record those decisions in `docs/PROGRESS.md`. Stop only for items in AGENTS.md "Ask before you" or if blocked.

## Goal
A new user taps through eight quick questions once, in the playful lime-green App A style, and lands on a summary screen. Answers are saved to `preferences` and editable in Settings. The app shell, landing, and login get a light pass so everything feels like the same app.

## Tasks

1. **Shared config and schema**
   - `src/config/preferences.ts`: mood tags, cooking days, diets, allergies, proteins, common dislikes, time options, each with label and emoji, matching the CHECK constraints from Phase 02 (read the migration, don't guess).
   - `src/lib/validation/preferences.ts` (Zod), used by the form and the server action: max 3 moods, at least 1 day, at least 1 protein, proteins that conflict with the diet rejected, dislikes trimmed and de-duplicated.
   - Pure helper `buildSummarySentence(prefs)` for the summary screen and Settings.

2. **Routing:** in the `(app)` layout or a server helper (not only the proxy), send users with `profiles.onboarding_completed_at` null to `/onboarding`. Completed users visiting `/onboarding` go to `/plan`.

3. **Onboarding UI** (`/onboarding`), one question per screen on all sizes, following `PRODUCT.md` section 2 order:
   1. Mood tiles, pick up to 3 (gentle message on a 4th tap).
   2. Cooking day toggles M to S (default Mon to Fri).
   3. Household: big number with round minus/plus (1 to 6, default 2), "includes kids" toggle.
   4. Diet: single-choice tiles.
   5. Allergies: multi-select tiles with None (None clears the others).
   6. Proteins: multi-select tiles; hide options that conflict with the diet.
   7. Dislikes: input with round add button, plus common-pick chips; removable tags.
   8. Time: weeknight choice plus weekend choice.
   - Pattern from the references: back arrow and thin progress bar at top; big bold lowercase heading with a short helper line; 2-column emoji tile grid; full-width pill Continue pinned at the bottom, faded and disabled until valid. Tiles are real buttons with `aria-pressed`, keyboard accessible, 44px+ targets.
   - Answers live in client state across steps; one save at the end.
   - Summary screen ("your plan is ready to build"): restates choices with `buildSummarySentence`, a small celebratory moment (one tasteful animation, respects reduced motion), and "Plan my week" (to `/plan`) plus "Edit answers".
   - Under allergies: "We'll keep these out of every plan. Always check product labels."

4. **Server action** `src/actions/preferences.ts`: validate, re-check user, upsert `preferences`, set `onboarding_completed_at`, and save the browser's timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`, validated as an IANA zone) to `profiles.timezone` (it defaults to UTC). Return the typed result. Settings shows the timezone with an option to change it.

5. **Settings** (`/settings`): the same fields grouped in sections on one page, reusing the onboarding tile components, prefilled; Save with toast; signed-in email and Sign out at the bottom.

6. **Light design pass on what exists** (tokens and components only, no hard-coded colors):
   - Refine the lime theme from Phase 01 so white or dark text on lime passes contrast; pastel colors for the seven mood tags as tokens.
   - App shell: active nav item in lime; Plan header placeholder greeting ("good morning, {first name}" with email-name fallback).
   - Landing and login: same type, colors, pill buttons as onboarding.
   - Record the final token values in `docs/DESIGN.md` (Tokens section).

7. **Tests:** unit tests for the Zod schema and `buildSummarySentence`; Playwright: signed-in test user completes onboarding and lands on `/plan`, and a returning user skips onboarding.

## Acceptance
`docs/ROADMAP.md` Phase 03 "Done when". All checks pass; screens verified at 375px and 1280px with `next-dev-loop`, with screenshots saved under `docs/design/screenshots/phase-03/`.

## Finish
Update `docs/PROGRESS.md`, commit, open the PR, and list manual test steps.
