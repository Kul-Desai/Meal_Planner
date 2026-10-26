# Phase 10: Launch readiness

**Branch:** `phase-10-launch`
**Read first:** `AGENTS.md`, `docs/DISTRIBUTION.md`, `docs/ROADMAP.md` Phase 10.
**Skills:** `supabase`, `supabase-postgres-best-practices`, `web-design-guidelines`.

The human does the dashboard parts; Codex does the code and writes a checklist for the rest. Do not connect MCP to production.

## Codex tasks
1. **Account and data controls** in Settings: "Download my data" (JSON of preferences, plans, feedback) and "Delete my account" (confirmation, deletes the auth user and all rows via cascade using the admin client in a server action). Public page `/delete-account` explaining how to request deletion without the app (Google Play requires both).
2. **Legal pages:** privacy policy and terms drafts in plain English covering what is collected (email, preferences, plans, feedback), AI processing by the chosen provider, no selling of data, deletion, contact email. Mark them "Draft: review before publishing".
3. **Monitoring:** Sentry for Next.js (client, server, edge) with source maps; PostHog with events: `signed_up`, `onboarding_completed`, `plan_generated`, `night_swapped`, `plan_locked`, `grocery_item_checked`, `feedback_given`, `next_week_drafted`. Respect a cookie/consent setting if required.
4. **Security pass:** run Supabase advisors; confirm no secret in client bundles (search build output); add security headers in `next.config.ts` (CSP report-only first); rate-limit auth-adjacent actions.
5. **SEO and sharing:** metadata, Open Graph image, `robots.ts`, `sitemap.ts` for public pages.
6. **Production checklist** in `docs/PROGRESS.md` for the human: create `meal-planner-prod` Supabase project, apply migrations with `supabase db push` (Supabase CLI), configure auth URLs and Google OAuth for the domain, set Vercel production env vars, connect the domain, verify Resend domain, set LLM spend limits.

## Finish
Update `docs/PROGRESS.md`. Commit. Manual test steps including a full new-user run on the production URL.
