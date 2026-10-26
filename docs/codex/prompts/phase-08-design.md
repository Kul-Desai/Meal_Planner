# Phase 08: Design pass

**Branch:** `phase-08-design`
**Read first:** `AGENTS.md`, `docs/DESIGN.md` (including the Brief, which the human has filled in), every image in `docs/design/references/`, `docs/PRODUCT.md`.
**Skills:** `frontend-design` (lead), `shadcn`, `web-design-guidelines`, `next-dev-loop`.

Run this in two Codex sessions.

## Session A: design plan only (no code)
1. Study the references and brief. Summarize in a few lines what the references have in common and what to take from each.
2. Following the `frontend-design` skill, propose:
   - Color: 4 to 6 named hex values mapped to shadcn tokens, for light and dark.
   - Type: one or two families (Google Fonts via `next/font`), roles, and a type scale.
   - Radius, spacing rhythm, shadow policy, motion policy (one orchestrated moment, everything else responsive to user action).
   - ASCII wireframes for Today, Plan (week), Groceries, Onboarding step, at mobile and desktop.
   - The single memorable element and why it fits a weeknight-dinner app.
3. Review your own plan against the brief and the skill's calibration list; revise anything generic and say what you changed.
4. Write the plan into `docs/DESIGN.md` (Tokens section and a new "Plan" section). Stop and wait for approval.

## Session B: apply (after approval)
1. Update tokens in `src/app/globals.css` and fonts in the root layout. No hard-coded colors in components.
2. Restyle shared components first (buttons, inputs, cards, nav), then screens in this order: Today, Plan, Groceries, Onboarding, Settings, Favorites, Landing, Login.
3. After each screen, screenshot at 375px and 1280px in light and dark with `next-dev-loop`; fix issues before moving on.
4. Run a `web-design-guidelines` review across all screens; fix findings.
5. Respect `prefers-reduced-motion`; keep focus states visible; check contrast.

## Finish
Update `docs/PROGRESS.md` with before/after notes and the screenshot paths. Commit. List anything you would still improve.
