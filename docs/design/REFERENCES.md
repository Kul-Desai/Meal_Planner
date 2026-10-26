# Design References: What We Take and What We Skip

Reviewed 2026-10-26. Screenshots in `references/`. Prefix `a-` = App A (primary direction), `b-` = App B (secondary). These are inspiration for layout, flow, and mood; the final design must be our own, not a copy of either app.

## Direction in one paragraph

Light, friendly, and fast. A warm off-white canvas, white rounded cards, one fresh green accent, bold lowercase headings, emoji as lightweight icons, and appetizing overhead food photos. Onboarding feels like tapping through a quiz, one question per screen. The plan screen is a scrollable week of photo cards, each with a colored mood tag and quick facts.

## App A (primary)

| File | Screen | Take | Skip / change |
|------|--------|------|---------------|
| a-01 | Mood tiles, pick up to 3 | 2-column emoji tile grid; selection limit in subtitle; continue disabled until valid | Rename "Low Calorie" to "Lighter" (we do not compute calories) |
| a-02 | Weekly budget slider | Big centered value as the hero of the screen (reuse this pattern for household size) | **Budget skipped for now** (decision 2026-10-26) |
| a-03 | Which days | M to S day toggles; replaces our 3/5/7 choice | Make selected state obvious (filled, not just a dot) |
| a-04 | People stepper | Large number with round minus/plus buttons; "we'll scale your meals" helper line | Drop "and budget" from helper text |
| a-05 | Diet, pick one | None / Vegetarian / Vegan / Pescatarian as single choice | None |
| a-06 | Allergies | Multi-select tiles, "None" option | Add our label reminder note |
| a-07 | Proteins you like | Protein tiles; anything not selected is never used (this is how "no pork, no beef" is expressed) | Add tofu, paneer, eggs, beans and lentils, shellfish |
| a-08 | Dislikes | Text input + add button, "common picks" chips | None |
| a-09 | Reminder (free trial) | Two-option radio card with "Recommended" note: good pattern for reminder settings later | App is free; no trial screen |
| a-10, a-11 | Plan home (top) | Greeting with first name ("Good morning, Chef KD"); two summary cards side by side; day pill above each meal card; photo + title + mood tag + time + servings | Replace the cost card with a **Tonight** card; replace store chip with plan range ("Mon Oct 26 to Fri Oct 30") |
| a-12 | Plan home (bottom) | Full-width "rebuild plan" primary button with a filter icon button beside it | Our version: "Draft next week" or "Lock in plan" depending on state; filter opens preferences |
| all | Bottom nav | plan, meals, preferences, settings | Ours: **Plan, Groceries, Meals, Settings** (preferences live inside Settings) |

## App B (secondary)

| File | Screen | Take | Skip |
|------|--------|------|------|
| b-01, b-02 | Goals and barriers checklists | Nothing for v1 | Out of scope |
| b-03 | Health reasons (GLP-1, pregnancy, etc.) | Nothing | **Skip**: health data, privacy burden, not our product |
| b-04, b-05 | Planning habits | Nothing | Adds questions without changing the plan |
| b-06 to b-08 | Activity, sex, age, height, weight | Nothing | **Skip**: calorie-tracker territory |
| b-09 | "Your plan is ready" summary | Celebratory finish screen restating the user's choices, with a single "See my plan" button | Calorie and protein targets |
| b-10 | Today with meal log rows | Nothing for now | Logging food |

## Onboarding order (decided 2026-10-26)

1. What are you in the mood for? (pick up to 3)
2. Which days will you be cooking? (day toggles)
3. How many people are you cooking for? (stepper)
4. Any dietary needs? (pick one)
5. Any allergies? (pick all that apply)
6. Which proteins do you like? (pick all that apply)
7. Any dislikes? (input + common picks)
8. Quick weeknight meals or longer cooking? (time choice)
9. Summary: "Your plan is ready to build" restating choices, button "Plan my week"

## Visual notes for Phase 08

- App A sits close to the "identical rounded cards with one soft shadow" default the `frontend-design` skill warns about. Keep its friendliness but find our own memorable element; the photo week-strip and the Tonight card are the strongest candidates.
- **Keep the lime green theme** (decided 2026-10-26). Phase 08 tunes the exact shade so white text on lime buttons passes contrast (or uses dark text on lime), and picks the pastel set for mood tags.
- Headings are bold, lowercase, and large; body text is small and gray. Watch contrast on gray helper text.
- Food photos use one consistent style: overhead shot, single bowl or plate, neutral stone or linen background, soft daylight. Our AI image prompt must lock this style so every meal card matches.
