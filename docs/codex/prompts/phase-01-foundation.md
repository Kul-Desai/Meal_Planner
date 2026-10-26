# Phase 01: Foundation and auth

**Branch:** `phase-01-foundation`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` sections 1 to 3 and 7 to 8, `docs/ROADMAP.md` Phase 01.
**Skills:** `supabase`, `shadcn`, `next-dev-loop`.

## Goal
A signed-in user sees an empty but working app shell; signed-out users can only see the landing page and login. Quality tooling and CI are in place so every later phase is checked automatically.

## Tasks

1. **Project hygiene**
   - Confirm Next.js 16 conventions from `node_modules/next/dist/docs/` before writing code.
   - Add scripts: `typecheck`, `test`, `test:e2e`, `db:types`.
   - Prettier with the Tailwind plugin; format the repo.
   - `.gitignore`: keep `.env*` ignored but add `!.env.example`. Create `.env.example` from `docs/ARCHITECTURE.md` section 8 with empty values.
   - `src/config/site.ts` with app name "Meal Planner", description, URLs.
   - `src/lib/env.ts`: Zod-validated env with separate server and client schemas; clear error listing missing vars.

2. **shadcn/ui**
   - Initialize shadcn (neutral base, CSS variables). Add: button, input, label, card, form, dialog, sheet, dropdown-menu, sonner (toasts), skeleton, separator, avatar, badge, tabs, checkbox, radio-group, select, textarea.
   - Light and dark mode following system preference.
   - Provisional theme tokens so the app already feels like the chosen direction (App A, playful and light): `--primary` a lime green with readable foreground text, `--background` a light warm off-white, cards white, larger radius on buttons (pill) and cards. Only change token values in `globals.css`; final values come in Phase 08.

3. **Supabase clients** (follow the `supabase` skill and `ARCHITECTURE.md` section 3 exactly)
   - `src/lib/supabase/client.ts`, `server.ts`, `proxy.ts` helper, and `src/proxy.ts` exporting `proxy`.
   - Public routes: `/`, `/login`, `/auth/*`, `/privacy`, `/terms`. Everything under `(app)` requires a user.

4. **Auth**
   - `/login`: email field that sends a magic link / one-time code, plus "Continue with Google".
   - `/auth/callback` route handler exchanges the code for a session; `/auth/confirm` handles email OTP links.
   - Sign out in the user menu.
   - After sign in, redirect to `/plan` (onboarding redirect comes in Phase 03).
   - Write the exact Google Cloud + Supabase dashboard steps for Google OAuth into `docs/PROGRESS.md` under "Human must do".

5. **App shell** in `src/app/(app)/layout.tsx`
   - Mobile (<768px): top bar with app name and user menu; bottom nav with Plan, Groceries, Meals, Settings (icons + labels). `/plan` is the home screen.
   - Desktop: left sidebar with the same items.
   - Placeholder pages for `/plan`, `/today`, `/groceries`, `/meals`, `/settings` with a heading and an empty state (`/today` is not in the nav; it opens from the Tonight card later).
   - Simple landing page at `/` for signed-out users (headline, one paragraph, "Get started" button). Signed-in users visiting `/` go to `/plan`.
   - Placeholder `/privacy` and `/terms` pages.

6. **Testing and CI**
   - Vitest with one test for `env.ts` parsing.
   - Playwright with one test: signed-out user visiting `/plan` lands on `/login`.
   - Set up how e2e tests sign in for later phases: a Playwright global setup that creates (or reuses) a test user in the dev project with the admin client, signs in, and saves storage state. Document it in `PROGRESS.md`.
   - `.github/workflows/ci.yml`: on pull requests and pushes to main, run install, lint, typecheck, test, build (use `AI_PROVIDER=mock` and dummy public Supabase values for build).

## Acceptance
Everything in `docs/ROADMAP.md` Phase 01 "Done when", plus: `npm run lint`, `typecheck`, `test`, `build` pass; verified in the browser at 375px and 1280px with `next-dev-loop`.

## Finish
Update `docs/PROGRESS.md` (use the template), commit, and give me manual test steps including how to test the magic link locally.
