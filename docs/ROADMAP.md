# Roadmap (lean plan, 2026-10-26)

Each phase is one Codex task on its own branch, ending in a pull request. Codex shows one plan, then builds without stopping for small choices; Claude reviews at the end ("review phase XX") before you merge. Prompts live in `docs/codex/prompts/`.

| Phase | Name | Outcome |
|-------|------|---------|
| 00 | Setup | Done |
| 01 | Foundation and auth | Done |
| 02 | Database and security | All tables, RLS, seed data, types, RLS tests |
| 03 | Onboarding | Eight-question quiz in the reference style, summary, Settings; light design pass on shell, landing, login |
| 04 | Plan + groceries | AI plan, protein choice, swap a night, lock in, combined grocery list |
| 05 | Week + learning | Tonight card and view, change tonight, feedback, Meals tab, draft next week (**MVP complete**) |

**Later** (prompts in `docs/codex/prompts/later/`; ask Claude to refresh one before running it):

| Item | What |
|------|------|
| Later 1 | AI meal photos cached in ImageKit |
| Later 2 | Installable app (PWA), offline grocery list, email and push reminders |
| Later 3 | Design polish pass |
| Later 4 | Launch readiness: production project, domain, custom email sender, legal pages, account deletion, monitoring |
| Also deferred | Leftovers helper, pantry staples, cook mode, weekly auto-draft, budget and cost per meal |

Dropped: Google Play (see `docs/archive/`).

---

## Phase 00: Setup (you)
Follow `docs/README.md` Step 0.
**Done when:** `npm run dev` shows the Next.js starter at localhost:3000; root `AGENTS.md` exists; `npx skills list` shows the seven skills; Codex can list tables in your Supabase dev project through MCP; Vercel shows a deployed preview.

## Phase 01: Foundation and auth
**Done when:**
- Sign in with email (magic link or code) and Google; sign out; session persists across refresh.
- Signed-out users visiting `/plan`, `/today`, `/groceries`, `/meals`, `/settings` are redirected to `/login`.
- App shell: bottom nav on mobile (Plan, Groceries, Meals, Settings), sidebar on desktop; `/plan` is home.
- `src/lib/env.ts` validates env vars; `.env.example` committed.
- Vitest and Playwright configured with one passing test each; GitHub Actions runs lint, typecheck, test, build on every PR.

## Phase 02: Database and security
**Done when:**
- Migrations create every table in `ARCHITECTURE.md` section 4 with RLS and policies.
- A trigger creates `profiles` and empty `preferences` rows on sign-up.
- Seed: ingredient catalog (about 150 common ingredients with categories, allergens, diet tags) and about 30 global seed recipes covering vegetarian, poultry, fish, under 30 minutes.
- RLS tests prove user A cannot read or write user B's rows.
- Generated types committed; Supabase security advisor shows no warnings.

## Phase 03: Onboarding
**Done when:**
- New users land on `/onboarding`; eight one-question steps (mood, days, people, diet, allergies, proteins, dislikes, time) in the App A style; back arrow, progress bar, Continue disabled until valid.
- Summary screen restates choices in plain words; "Plan my week" goes to `/plan`.
- Preferences saved; `onboarding_completed_at` set; returning users skip onboarding.
- `/settings` edits the same preferences.
- Shell, landing, and login share the refined lime theme; final tokens recorded in `docs/DESIGN.md`.

## Phase 04: Plan + groceries
**Done when:**
- "Plan my week" creates a draft with one night per selected cooking day; works with `AI_PROVIDER=mock` and with a real provider key.
- Constraint tests cover allergies, diet, unliked proteins, dislikes, time limits, cooking days; a planted violation is caught and that night regenerated.
- Plan home shows greeting, Tonight and Grocery summary cards, and night cards with photo placeholder, mood tag, minutes, servings, protein choice.
- Swap one night changes only that night; lock in creates the grocery list.
- Grocery list combines duplicates, scales to household, applies protein choice, groups by store section; check off, add, remove, copy/share; swaps on a locked plan update the list and keep check marks.
- Rate limits enforced; generations logged.

## Phase 05: Week + learning
**Done when:**
- Tonight card opens `/today` with steps and ingredients; correct "tonight" in the user's timezone; empty states covered.
- Change tonight (missing ingredient, quicker, skip) works and updates the grocery list.
- One-tap feedback on past meals; Meals tab shows loved, "not again" (with undo), and past meals.
- "Draft next week" builds from preferences and feedback; tests prove "not again" meals are excluded.
