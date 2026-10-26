# Design

Status: **not started** (Phase 08). Until then, Codex uses shadcn defaults and semantic tokens only, so the whole app can be reskinned by editing tokens.

## Workflow

1. **Collect references (you).** Save 8 to 15 Dribbble shots into `docs/design/references/` as images, named by what you like about each: `ref-01-tonight-card-layout.png`, `ref-02-grocery-checklist.png`. Search terms that work: "meal planner app", "recipe app mobile", "grocery list app", "food delivery dashboard", "weekly planner mobile". Treat shots as inspiration for layout, density, and mood, not something to copy; the final design must be our own.
2. **Write the brief (you, 10 minutes).** Fill in the "Brief" section below: three words for the feel, who it is for, and one thing it must never look like.
3. **Design plan (Codex with `frontend-design` skill).** Codex reads the references and brief, proposes a token system (4 to 6 named colors, type families and scale, radius, spacing, motion) and ASCII wireframes for Today, Plan, Groceries. It reviews its own plan against the brief and revises anything generic.
4. **Approve (you, with Claude).** Share the plan; we pick and adjust.
5. **Apply (Codex with `shadcn` + `frontend-design`).** Update tokens in `globals.css`, adjust components, restyle screens one at a time, screenshot at 375px and 1280px.
6. **Review (Codex with `web-design-guidelines`, then Claude).** Accessibility and UX audit, then fix.

## Brief (fill in before Phase 08)

- Feel in three words:
- Audience reminder: busy people cooking weeknight dinners for 1 to 6 people.
- The single memorable element (for example, the "tonight" card, the week strip, the grocery checklist):
- Must never look like:
- Light/dark: both, following system setting.
- Ideas to borrow from the Good Idea Solar site build (layout patterns, component structure, Codex prompt style):

## Things the design must get right

- **Tonight view** readable at arm's length in a kitchen: large type for the meal name and step list.
- **Week strip** that makes "shared ingredients" visible at a glance.
- **Grocery list** optimized for one-handed use in a store: big tap targets, checked items move down, sections collapsible.
- **Swap flow** in two taps: pick night, pick reason.
- **Empty and error states** that tell the user what to do next.

## Calibration (avoid templated defaults)

From the `frontend-design` skill: avoid the warm-cream-plus-terracotta look, near-black with one neon accent, identical rounded cards with the same soft shadow everywhere, ALL-CAPS eyebrow labels over every heading, and numbered 01/02/03 markers on content that is not a sequence. Food apps also overuse orange-and-green "fresh" palettes and stock salad photos; push past those.

## Tokens (filled in during Phase 08)

```
--background:
--foreground:
--primary:
--primary-foreground:
--accent:
--muted:
--border:
--radius:
font-display:
font-body:
type scale:
```
