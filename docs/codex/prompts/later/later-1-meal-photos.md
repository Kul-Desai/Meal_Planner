# Phase 04b: Meal photos

> **Deferred in the lean plan (2026-10-26).** Written before phases were merged: references to old phase numbers map as 03 Onboarding, 04 Plan + groceries, 05 Week + learning. Leftovers, pantry, cook mode, and the weekly auto-draft were cut from the MVP; re-add them deliberately if this prompt depends on them. Ask Claude to refresh this prompt before running it.

**Branch:** `phase-04b-meal-photos`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` section 9 (all of it), `docs/design/REFERENCES.md` (photo style notes), `docs/ROADMAP.md` Phase 04b. Look at `docs/design/references/a-10-plan-home-top.png` for how photos sit in meal cards.
**Skills:** `supabase`, `vercel-react-best-practices`, `next-dev-loop`.

## Goal
Every meal card shows an appetizing overhead photo in one consistent style. Each dish is generated once, cached, and reused for every user, with a hard daily cost cap.

## Tasks

1. **Plan first.** Confirm the current AI SDK image generation API and provider support by reading the installed `ai` package docs/types (do not rely on memory). Propose the image model for `AI_IMAGE_MODEL`, output size, and expected cost per image. Wait for my OK.

2. **Style prompt (pure, tested)** `src/lib/images/prompt.ts`
   - One locked template: overhead shot, single ceramic bowl or plate, neutral stone or linen background, soft natural daylight, appetizing, realistic, no text, no hands, no utensils across the dish, no brand packaging.
   - Inputs: dish title + up to 5 key ingredients. Unit-test that the style text is always present and user text cannot remove it.

3. **ImageKit** `src/lib/images/imagekit.ts`
   - Install the official ImageKit Node SDK; server-only upload with `IMAGEKIT_PRIVATE_KEY` to folder `/meals/` named `<fingerprint>.webp`.
   - URL builder for display with transformations: square crop, width per breakpoint (e.g. 160, 320, 640), auto format and quality. Use it from a small `MealPhoto` component (`next/image` with a custom loader, or a plain `<img>` with `srcset`; pick one and explain).
   - Add the ImageKit env vars to `src/lib/env.ts` and `.env.example`.

4. **Generation and cache** `src/lib/images/generate.ts`, `queue.ts`
   - After a plan is saved or a night is swapped, collect recipes whose fingerprint has no `ready` row in `recipe_images`; insert `pending` rows (unique on fingerprint, so concurrent requests do not double-generate).
   - Run generation after the response is sent (Next.js `after()`), never blocking the plan screen.
   - Generate, upload, mark `ready` with URL; on failure mark `failed` with the error and allow a retry later.
   - Enforce `AI_IMAGE_DAILY_CAP` across all users (count today's `image` rows in `ai_generations`); over the cap, leave `pending` for the next day's run.
   - Add a cron route `src/app/api/cron/images/route.ts` (secured with `CRON_SECRET`) that retries `pending` and `failed` rows within the cap; schedule daily in `vercel.json`.

5. **Seed photos:** script `npm run images:seed` that generates photos for all global seed recipes (respecting the cap, resumable).

6. **Mock mode:** with `AI_PROVIDER=mock`, use 6 bundled sample food photos in `public/mock-meals/` assigned by fingerprint hash; no network calls. Tests and CI use this.

7. **UI:** meal cards and the Tonight card use `MealPhoto`. Placeholder while pending: rounded square in the mood tag's color with the dish's first letter (no layout shift; fixed aspect ratio). Fade in when ready (respect reduced motion). Cards refresh photos without a full reload (poll the plan's photo status every few seconds while any are pending, stop when all are ready).

8. **Tests:** prompt unit tests; cache test (two plans with the same dish create one `recipe_images` row and one generation); cap test; Playwright with mock mode: plan shows placeholders then photos.

## Acceptance
`docs/ROADMAP.md` Phase 04b "Done when". Generate 5 real photos with my keys, list their URLs in `PROGRESS.md`, and report time and cost per image.

## Finish
Update `docs/PROGRESS.md` (include ImageKit setup steps under "Human must do"), commit, manual test steps.
