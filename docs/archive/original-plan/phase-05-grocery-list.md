> **Superseded by the lean plan (2026-10-26).** Kept for reference only. Do not execute.

# Phase 05: Grocery list

**Branch:** `phase-05-grocery-list`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` section 6, `docs/PRODUCT.md` section 5, `docs/ROADMAP.md` Phase 05.
**Skills:** `shadcn`, `web-design-guidelines`, `next-dev-loop`.

## Goal
Locking a plan produces a grocery list a person can trust in the store: combined, scaled, leftovers subtracted, grouped by aisle.

## Tasks

1. **Pure engine first (no database, no AI)**
   - `src/lib/groceries/units.ts`: unit families (volume, weight, count), conversion to base units (ml, g), friendly output for US locale (tsp/tbsp/cup, oz/lb), rounding to shopping sizes. Never convert between volume and weight.
   - `src/lib/groceries/categories.ts`: category order and fallback.
   - `src/lib/groceries/aggregate.ts`: implements the 7 steps in section 6.
   - Unit tests (at least 20): duplicates across nights combine; mixed units in one family sum; volume + weight of the same item stay as two lines; protein choice swaps the ingredient; skipped nights excluded; leftover produced Monday and used Thursday is not bought twice; pantry `always_have` items go to "Check you have"; rounding ("about 2 lb chicken").

2. **Persistence and actions** (`src/actions/groceries.ts`)
   - `lockPlan` (from Phase 04) now also builds the list.
   - `toggleItem`, `addManualItem`, `removeItem`, `markHaveAtHome`, `setAlwaysHave` (adds to `pantry_items`).
   - `rebuildList(planId)`: recompute plan-sourced items after a swap; keep manual items; keep check marks on items that still exist.
   - Use optimistic UI for toggles.

3. **UI** (`/groceries`)
   - Header: plan week and household size; counts ("18 items, 5 checked").
   - Sections in category order, collapsible; checked items move to the bottom of their section with strikethrough.
   - Large tap targets (at least 44px rows); works one-handed.
   - Add item input at top; swipe or menu to remove / "already have it" / "always have this".
   - "Check you have" collapsed group for pantry staples.
   - Copy as text and native share (`navigator.share` where available) in a clean format:
     ```
     Groceries for week of Oct 26 (2 people)
     PRODUCE
     - Spinach, 1 bag
     ...
     ```
   - Empty states: no locked plan (link to `/plan`), all checked ("You're all set").

4. **Tests:** Playwright: lock plan -> list appears -> check item -> swap a night -> list updates and check mark persists.

## Acceptance
`docs/ROADMAP.md` Phase 05 "Done when".

## Finish
Update `docs/PROGRESS.md` with the grocery list generated from the mock plan pasted in, for review. Commit. Manual test steps.
