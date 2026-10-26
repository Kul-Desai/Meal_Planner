# Phase 06: During the week

**Branch:** `phase-06-during-the-week`
**Read first:** `AGENTS.md`, `docs/PRODUCT.md` section 6, `docs/ROADMAP.md` Phase 06.
**Skills:** `shadcn`, `web-design-guidelines`, `next-dev-loop`.

## Goal
During an active week the app is useful every evening: it shows tonight's dinner, adapts when plans change, and helps use leftovers.

## Tasks

1. **Tonight card + Tonight view.** Wire the Tonight card on `/plan` (meal name, photo, minutes, "Start cooking"), and build `/today` (opened from the card)
   - Tonight's meal: title, minutes, servings, protein choice, ingredients checklist, numbered prep steps (large readable type), "Cook mode" toggle that keeps the screen awake via the Wake Lock API where supported.
   - Tomorrow preview (one line).
   - States: no plan ("Plan your week" CTA), draft not locked ("Lock in your plan"), plan ended ("Draft next week" placeholder until Phase 07), tonight skipped.
   - Use the user's timezone from `profiles` to decide "tonight".

2. **Actions** (`src/actions/today.ts`)
   - `markCooked`, `markSkipped`.
   - `swapTonight(reason)`: reasons "Missing an ingredient" (ask which), "Plans changed" (skip tonight, option to move tonight's meal to a later night and shift), "Want something quicker" (lower time limit for this swap). Reuse `swapNight` from Phase 04 with extra context, e.g. exclude the missing ingredient.
   - After any change, call `rebuildList` if the list exists.

3. **Leftovers helper** (pure logic in `src/lib/plan/leftovers.ts`, unit-tested)
   - When a meal is skipped, its perishable ingredients become "possibly left over".
   - Partial-pack items (half a cabbage, extra spinach) from the grocery rounding are tracked as leftovers.
   - Show a tip card on `/today` when a later meal could use a leftover, or offer "Suggest a use" which asks the AI for one quick idea (uses the swap pipeline with a "use this leftover" instruction; constraint-checked).

4. **Tests:** unit tests for leftovers and timezone "tonight" logic; Playwright: today view shows the right meal for a fixed date; skip tonight updates plan and list.

## Acceptance
`docs/ROADMAP.md` Phase 06 "Done when".

## Finish
Update `docs/PROGRESS.md`, commit, manual test steps.
