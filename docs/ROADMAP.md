# Roadmap

Each phase is one Codex task on its own branch, ending in a pull request you review and merge. Prompts live in `docs/codex/prompts/`. Do not skip the review step: after each phase, ask Claude to "review phase XX" so the code in this folder gets checked before you merge.

| Phase | Name | Who | Outcome |
|-------|------|-----|---------|
| 00 | Setup | You (terminal + dashboards) | Repo, scaffold, skills, Supabase project, MCP, Vercel |
| 01 | Foundation and auth | Codex | Sign in/out works, protected app shell, CI green |
| 02 | Database and security | Codex | All tables, RLS, seed data, generated types, RLS tests |
| 03 | Onboarding | Codex | Four questions saved; settings can edit them |
| 04 | Plan engine | Codex | AI drafts a valid plan; swap one night; lock in |
| 05 | Grocery list | Codex | Correct combined list with check-off and sharing |
| 06 | During the week | Codex | Tonight view, swap tonight, leftovers tips |
| 07 | Learning and recurring | Codex | Feedback, favorites, draft next week, weekly auto-draft |
| 08 | Design pass | You + Codex | Dribbble references -> tokens -> polished UI |
| 09 | Installable app and reminders | Codex | PWA install, offline list, email and push reminders |
| 10 | Launch readiness | You + Codex | Production project, domain, legal pages, account deletion, monitoring |
| 11 | Google Play | You + Codex | TWA build, closed test, production listing |
| 12 | iOS (optional) | Later | Capacitor app with native value |

MVP = phases 00 to 07 (usable product with neutral styling). Public launch = through 10.

---

## Phase 00: Setup (you)
Follow `docs/README.md` Step 0.
**Done when:** `npm run dev` shows the Next.js starter at localhost:3000; root `AGENTS.md` exists; `npx skills list` shows the seven skills; Codex can list tables in your Supabase dev project through MCP; Vercel shows a deployed preview.

## Phase 01: Foundation and auth
**Done when:**
- Sign in with email (magic link or code) and Google; sign out; session persists across refresh.
- Signed-out users visiting `/today`, `/plan`, `/groceries`, `/settings` are redirected to `/login`.
- App shell: bottom nav on mobile (Today, Plan, Groceries, Settings), sidebar on desktop.
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
- New users land on `/onboarding`; four steps with defaults; back/next; progress indicator.
- Confirmation screen restates choices in plain words.
- Data saved to `preferences`; `onboarding_completed_at` set; returning users skip onboarding.
- `/settings` edits the same preferences.

## Phase 04: Plan engine
**Done when:**
- "Plan my week" creates a draft with the right number of nights from the chosen start date.
- Works fully with `AI_PROVIDER=mock`, and with a real provider when a key is set.
- Constraint checker unit tests cover allergies, diet flags, dislikes, time limits, night count; a planted violation is caught and that night is regenerated.
- Plan screen shows each night, protein choice picker, shared ingredients summary.
- Swap one night with a reason changes only that night.
- "Lock in plan" sets status to locked.
- Rate limits enforced; generations logged.

## Phase 05: Grocery list
**Done when:**
- Locking a plan creates the grocery list; unit tests prove duplicates combine, units convert, leftovers subtract, protein choice applies, household scaling is correct.
- List grouped by store section; check off, add manual item, remove, "already have it".
- Copy as text / native share on mobile.
- Swapping a night in a locked plan updates the list and keeps manual items and check marks.

## Phase 06: During the week
**Done when:**
- `/today` shows tonight's dinner with steps and ingredients; empty states for "no plan" and "plan ended".
- "Swap tonight" with reasons (missing ingredient, plans changed, want quicker) works and updates the list.
- Mark tonight cooked or skipped; skipped meal ingredients are flagged as possible leftovers.
- Leftover tip shows when a later meal can use something left over.

## Phase 07: Learning and recurring
**Done when:**
- After a meal date passes, a one-tap feedback prompt appears (Loved it / It was fine / Not again).
- `/favorites` lists loved meals and the "not again" list, both editable.
- "Draft next week" uses preferences + feedback; unit test proves "not again" meals are excluded and loved meals are included in the prompt context.
- Weekly auto-draft cron route (secured with `CRON_SECRET`) drafts plans for users who opted in.

## Phase 08: Design pass
**Done when:** `docs/DESIGN.md` has the chosen direction and tokens; all screens restyled through tokens and components; `web-design-guidelines` review passes; screenshots at 375px and 1280px reviewed by you.

## Phase 09: Installable app and reminders
**Done when:** Lighthouse installability passes; install prompt on desktop/Android and iPhone instructions; grocery list works offline; daily dinner reminder by email (Resend) and web push, both opt-in from Settings.

## Phase 10: Launch readiness
**Done when:** production Supabase project with migrations applied; Vercel production env vars set; custom domain; privacy policy and terms; data export and account deletion (in-app and a public web page); Sentry and PostHog wired; landing page with "Get the app" section.

## Phase 11: Google Play
**Done when:** `assetlinks.json` served; Bubblewrap/PWABuilder project builds a signed `.aab`; closed test running with 12+ testers for 14 consecutive days; store listing assets ready; production access requested.
