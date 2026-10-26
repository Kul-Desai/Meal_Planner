# AGENTS.md: Meal Planner

Instructions for Codex (and any coding agent) working in this repo. Read this file fully at the start of every task.

## What we are building

A meal planner web app (desktop and mobile, later installable and on Google Play). Users sign in, answer four onboarding questions (days to plan, household size, dietary rules, time budget), get an AI-drafted dinner plan whose nights share ingredients, swap any single night, lock the plan in, and get one combined grocery list. During the week the app shows tonight's dinner, handles swaps and leftovers, and learns from feedback so next week's plan starts closer to what the user likes.

## Read before you code

| File | Read when |
|------|-----------|
| `docs/PRODUCT.md` | Any feature work: user flows, copy, scope |
| `docs/ARCHITECTURE.md` | Any code: stack, folders, data model, AI pipeline, grocery engine |
| `docs/ROADMAP.md` | To confirm which phase you are in and its acceptance criteria |
| `docs/PROGRESS.md` | At the start of every task: what is done, open issues, decisions |
| `docs/DESIGN.md` | Any UI work (tokens, references, rules) |

Work only on the phase you were asked to do. Do not start the next phase.

## Stack

- Next.js 16 App Router, TypeScript strict, `src/` directory, import alias `@/*`
- Tailwind CSS v4, shadcn/ui
- Supabase via `@supabase/ssr` and `@supabase/supabase-js`
- Zod for every schema; React Hook Form for complex forms
- Vercel AI SDK v7 (`ai`) for LLM calls
- Vitest (unit), Playwright (e2e)
- npm (do not switch package managers)

## Commands

```
npm run dev          # local dev server
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run test:e2e     # Playwright
npm run build        # production build
npm run db:types     # regenerate src/lib/supabase/database.types.ts
```

If a script is missing, add it to `package.json` in the phase that needs it.

## Skills installed in `.agents/skills`

Use them; they exist for a reason.

| Skill | Use when |
|-------|----------|
| `supabase` | Anything touching Supabase: auth, SSR clients, storage, cron, MCP |
| `supabase-postgres-best-practices` | Before writing any SQL, migration, RLS policy, index, or function |
| `shadcn` | Adding or composing UI components, applying design tokens |
| `frontend-design` | Any visual design decision or the design pass |
| `web-design-guidelines` | Reviewing UI for accessibility and UX before finishing a UI task |
| `vercel-react-best-practices` | Writing or reviewing React/Next.js code for performance |
| `next-dev-loop` | After edits, verify the page actually works in a running `next dev` |

The Next.js block at the top of this file points to version-matched docs in `node_modules/next/dist/docs/`. Prefer those over memory; Next.js 16 differs from older versions (for example `proxy.ts` replaced `middleware.ts`).

## Supabase MCP

The Supabase MCP server is connected to the **development project only**.
- Create schema changes as SQL files in `supabase/migrations/` (timestamped names) and apply them with the MCP `apply_migration` tool. Never run DDL ad hoc with `execute_sql`.
- Never edit a migration that has been applied. Write a new one.
- After any schema change, regenerate types (`npm run db:types` or the MCP type generation tool) and commit them.
- Run the MCP security and performance advisors after schema changes and fix warnings.

## Coding rules

**General**
- Server Components by default. Add `"use client"` only for interactivity; keep client components small and at the leaves.
- Mutations go through Server Actions in `src/actions/`. Every action: validate input with Zod, get the user with `supabase.auth.getUser()`, return a typed result `{ ok: true, data } | { ok: false, error }`. Never throw raw errors to the client.
- No `any`. No `@ts-ignore` without a comment explaining why.
- Keep files focused (aim for under ~200 lines). Extract pure logic into `src/lib/` so it can be unit tested.
- Use `src/lib/env.ts` for environment variables; never read `process.env` elsewhere.
- Dates: store ISO dates; display in the user's timezone from `profiles.timezone`.

**Supabase**
- Use only `@supabase/ssr` helpers in `src/lib/supabase/`. Cookies use only `getAll`/`setAll`.
- `src/proxy.ts` refreshes sessions; it is not authorization. Check the user again in every server action and protected page.
- Every table has RLS enabled with explicit policies. No table is ever left without RLS.
- The secret key is used only in `src/lib/supabase/admin.ts`, imported only by cron routes, guarded by `import "server-only"`.

**AI**
- All LLM code lives in `src/lib/ai/` and starts with `import "server-only"`.
- Structured output uses `generateText` with `output: Output.object({ schema })`. Do not use `generateObject` or `streamObject` (deprecated in AI SDK 6+).
- Every AI result passes `src/lib/plan/constraints.ts` before it is saved or shown. Allergies and diet rules are hard constraints enforced in code, never trusted to the model.
- `AI_PROVIDER=mock` must always work: deterministic fixture output, no network. Tests and CI use mock.
- Log every generation to `ai_generations` and enforce the per-user daily limits.

**Grocery list**
- Aggregation, unit conversion, and leftover subtraction are deterministic code in `src/lib/groceries/`. Never use an LLM for this. Cover with unit tests.

**UI (until the design phase)**
- Use shadcn defaults and semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.). No hard-coded hex colors or arbitrary color values, so the design pass can reskin by changing tokens.
- Mobile first. Check every screen at 375px and 1280px wide.
- Accessible by default: labels on inputs, visible focus, buttons are `<button>`, color is never the only signal.
- Interface copy follows `docs/PRODUCT.md`: plain words, sentence case, action-named buttons ("Lock in plan", "Swap this night").

## Workflow for every task

1. Read `docs/PROGRESS.md` and the phase prompt you were given.
2. Create a branch `phase-XX-short-name` from `main`.
3. Make a short plan (list of files to create/change) before writing code.
4. Build in small commits with clear messages.
5. Before you say you are done, all of these pass: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`. For UI work, verify in the browser with `next-dev-loop` at mobile and desktop widths.
6. Update `docs/PROGRESS.md`: what you built, files touched, new dependencies (with reason), decisions, known issues, and anything the human must do (keys, dashboard settings).
7. Finish with a short summary and the exact manual test steps for the human.

## Ask before you

- Add a new paid service or a dependency not listed in `docs/ARCHITECTURE.md`.
- Change the data model in a way not described in `docs/ARCHITECTURE.md`.
- Delete files outside the scope of the current phase.
- Touch anything related to the production Supabase project or production env vars.

## Never

- Commit secrets or `.env.local`. Only `.env.example` is committed.
- Disable RLS or write a policy using `true` for user data.
- Put the secret key or any API key in client code or `NEXT_PUBLIC_*` vars.
- Let AI output reach the database or the screen without constraint checks.
- Mark a phase done with failing lint, types, tests, or build.
