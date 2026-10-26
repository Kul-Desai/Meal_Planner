# Progress Log

Codex updates this file at the end of every phase. Newest entry on top. Claude reviews it when you say "review phase XX".

## Current status

- Current phase: **00 Setup**
- Last merged phase: none
- Blockers: none

## Human to-do (keys, dashboards, decisions)

- [ ] Phase 00 checklist in `docs/README.md`

## Decisions log

| Date | Decision | Why |
|------|----------|-----|
| 2026-10-26 | Next.js 16 + Tailwind v4 + shadcn/ui + Supabase (`@supabase/ssr`) | One codebase for web and installable PWA |
| 2026-10-26 | Vercel AI SDK v7 with structured output and a mock provider | Provider-agnostic; app works without keys in dev and CI |
| 2026-10-26 | Grocery math and allergy checks in code, never in the LLM | Correctness and safety |
| 2026-10-26 | PWA first, iOS later (optional) | Least extra work; keeps server features |
| 2026-10-26 | Google Play listing dropped | Not worth the $25 fee and 14-day closed test right now; Android users install the PWA from the website |
| 2026-10-26 | AI-generated meal photos, cached per dish in ImageKit (Phase 04b) | Photos are central to the reference design; cache keeps cost tied to distinct dishes |
| 2026-10-26 | Design direction from App A references (see `docs/design/REFERENCES.md`); keep its playful, light lime green theme | Playful tap-through onboarding, photo meal cards, Plan as home |
| 2026-10-26 | Onboarding expanded to 8 questions: mood tags, exact cooking days, proteins liked added | Better-fitting plans; proteins replace "no pork / no beef" presets |
| 2026-10-26 | Budget and cost per meal deferred | No reliable price data yet; keeps MVP focused |
| 2026-10-26 | App is free; no trial or payments | Validate usefulness first |
| 2026-10-26 | Skip health questions (sex, weight, activity, medical) | Out of scope; avoids storing health data |
| 2026-10-26 | Nav: Plan (home), Groceries, Meals, Settings; Tonight is a card on Plan | Matches reference layout |

## Phase entries

<!-- Template for Codex:
### Phase XX: Name (YYYY-MM-DD)
**Branch:** phase-XX-name  |  **PR:** #
**Built:**
-
**Files touched (main ones):**
-
**New dependencies:**
- package: reason
**Decisions:**
-
**Known issues / follow-ups:**
-
**Human must do:**
-
**Manual test steps:**
1.
-->
