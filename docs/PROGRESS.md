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
| 2026-10-26 | Next.js 16 + Tailwind v4 + shadcn/ui + Supabase (`@supabase/ssr`) | One codebase for web, PWA, and Play Store |
| 2026-10-26 | Vercel AI SDK v7 with structured output and a mock provider | Provider-agnostic; app works without keys in dev and CI |
| 2026-10-26 | Grocery math and allergy checks in code, never in the LLM | Correctness and safety |
| 2026-10-26 | PWA first, Google Play via Trusted Web Activity, iOS later | Least extra work; keeps server features |
| 2026-10-26 | No recipe photos in MVP; ImageKit when uploads arrive | Speed and cost |

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
