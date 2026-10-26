# Phase 02: Database and security

**Branch:** `phase-02-database`
**Read first:** `AGENTS.md`, `docs/ARCHITECTURE.md` section 4, `docs/ROADMAP.md` Phase 02.
**Skills:** `supabase-postgres-best-practices` (load before any SQL), `supabase`.
**Tools:** Supabase MCP (dev project).

## Goal
The complete data model exists in the dev project with Row Level Security, seed data, generated TypeScript types, and tests proving users cannot see each other's data.

## Tasks

1. **Plan first.** Show me the list of migrations you will create and any changes you suggest to the data model in `ARCHITECTURE.md` section 4 (with reasons). Wait for my OK before applying.

2. **Migrations** in `supabase/migrations/` (timestamped), applied via MCP `apply_migration`:
   - Enums or check constraints for statuses, ratings, units, categories.
   - Tables from section 4 with foreign keys, `on delete cascade` where user-owned, indexes listed in section 4.
   - `updated_at` trigger where the table has `updated_at`.
   - RLS enabled on every table. User-owned tables: select/insert/update/delete only where `auth.uid() = user_id` (use `(select auth.uid())` form for performance per the skill). `ingredients` and global `recipes` (`user_id is null`) readable by authenticated users, writable by no one except the service role.
   - Trigger on `auth.users` insert that creates `profiles` and `preferences` rows with defaults (5 days, household 2, 45 minutes weekday, 60 weekend).

3. **Seed** (`supabase/seed.sql`, also applied to dev):
   - About 150 ingredients: canonical name, aliases, category (Produce, Protein, Dairy and eggs, Bakery, Pantry, Frozen, Other), default unit, allergens (peanut, tree_nut, dairy, egg, gluten, shellfish, fish, soy, sesame), diet tags (meat, poultry, pork, beef, fish, shellfish, dairy, egg, gluten).
   - About 30 global recipes with ingredients and steps: at least 10 vegetarian, 8 poultry, 4 fish, 12 under 30 minutes, varied cuisines (American, Mexican, Italian, Indian, Chinese, Mediterranean). These are the fallback when AI output fails constraints.

4. **Types:** generate `src/lib/supabase/database.types.ts`, wire it into the Supabase clients, add helper types (`Tables<'meal_plans'>` etc.).

5. **RLS tests** in `supabase/tests/`: create two users, confirm user A cannot select, insert, update, or delete user B's rows in every user-owned table; confirm users cannot write to `ingredients`. Add a script to run them and document it in `PROGRESS.md`.

6. **Advisors:** run the MCP security and performance advisors; fix every warning or explain why not.

## Acceptance
`docs/ROADMAP.md` Phase 02 "Done when". All checks pass.

## Finish
Update `docs/PROGRESS.md` and `docs/ARCHITECTURE.md` if the model changed. Commit. Give me a short description of each table in plain English.
