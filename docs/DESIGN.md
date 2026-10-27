# Design

Status: **Phase 03 onboarding and preferences applied** (2026-10-27). See `design/REFERENCES.md` for what we take and skip from each screenshot. The remaining design work is polish around the weekly plan and food imagery, not a replacement of this direction.

## Workflow

1. **Collect references (you).** Save 8 to 15 Dribbble shots into `docs/design/references/` as images, named by what you like about each: `ref-01-tonight-card-layout.png`, `ref-02-grocery-checklist.png`. Search terms that work: "meal planner app", "recipe app mobile", "grocery list app", "food delivery dashboard", "weekly planner mobile". Treat shots as inspiration for layout, density, and mood, not something to copy; the final design must be our own.
2. **Write the brief (you, 10 minutes).** Fill in the "Brief" section below: three words for the feel, who it is for, and one thing it must never look like.
3. **Design plan (Codex with `frontend-design` skill).** Codex reads the references and brief, proposes a token system (4 to 6 named colors, type families and scale, radius, spacing, motion) and ASCII wireframes for Plan home, Tonight view, Groceries. It reviews its own plan against the brief and revises anything generic.
4. **Approve (you, with Claude).** Share the plan; we pick and adjust.
5. **Apply (Codex with `shadcn` + `frontend-design`).** Update tokens in `globals.css`, adjust components, restyle screens one at a time, screenshot at 375px and 1280px. Phase 03 established the onboarding, auth, navigation, and preference baseline.
6. **Review (Codex with `web-design-guidelines`, then Claude).** Accessibility and UX audit, then fix.

## Brief (fill in before Phase 08)

- Feel in three words: playful, light, fresh
- **Theme (decided 2026-10-26): keep App A's playful, light lime green look.** Light warm off-white background, white cards, lime green as the primary color (buttons, progress, selected states, active nav), pastel mood-tag chips, bold lowercase headings, emoji icons, overhead food photos. Phase 08 refines this theme (exact shades, contrast, type, spacing, dark mode); it does not replace it.
- Audience reminder: busy people cooking weeknight dinners for 1 to 6 people.
- The single memorable element (draft): the week of photo meal cards, with the Tonight card as the first thing you see
- Must never look like: a calorie tracker or a medical app; a generic SaaS dashboard
- Light/dark: light is the primary experience; dark mode follows the system setting and keeps the lime accent.
- Ideas to borrow from the Good Idea Solar site build (layout patterns, component structure, Codex prompt style):

## Things the design must get right

- **Tonight view** readable at arm's length in a kitchen: large type for the meal name and step list.
- **Week strip** that makes "shared ingredients" visible at a glance.
- **Grocery list** optimized for one-handed use in a store: big tap targets, checked items move down, sections collapsible.
- **Swap flow** in two taps: pick night, pick reason.
- **Empty and error states** that tell the user what to do next.

## Calibration (avoid templated defaults)

From the `frontend-design` skill: avoid the warm-cream-plus-terracotta look, near-black with one neon accent, identical rounded cards with the same soft shadow everywhere, ALL-CAPS eyebrow labels over every heading, and numbered 01/02/03 markers on content that is not a sequence. Food apps also overuse orange-and-green "fresh" palettes and stock salad photos; push past those.

## Tokens

```
--background: warm off-white
--foreground: deep green-black
--card: white
--primary: lime green; used for actions, progress, selected states, and active nav
--primary-foreground: deep green-black for readable lime buttons
--secondary / --accent: pale lime surfaces
--muted / --border: warm neutral surfaces and quiet separators
--mood-speedy through --mood-protein: seven low-saturation mood surfaces
--radius: 1.125rem base radius; cards and onboarding tiles use the semantic larger sizes
font-display: Geist Sans, bold and compact
font-body: Geist Sans
type scale: 12–14px helpers, 16px body, 20px section labels, 30–48px task headings
```

## Phase 03 interaction rules

- Onboarding keeps one decision per screen: a large plain-language prompt, short helper, obvious selected state, Back button, progress bar, and a pinned minimum-44px Continue button.
- Choice tiles, day buttons, chips, and steppers use real buttons with visible keyboard focus and `aria-pressed` state. Lime is never the only selected-state signal.
- Settings groups the same choices into editable sections and saves with an explicit confirmation toast.
- The app uses lime as a surface/action color, never low-contrast body text. Time zone labels are human-readable and DST-stable (for example, “Eastern Time (New York)”).
