# Phase 09: Installable app and reminders

**Branch:** `phase-09-pwa-reminders`
**Read first:** `AGENTS.md`, `docs/DISTRIBUTION.md` section 2, the Next.js PWA guide in `node_modules/next/dist/docs/`, `docs/ROADMAP.md` Phase 09.
**Skills:** `vercel-react-best-practices`, `next-dev-loop`.

## Goal
Users can install the app on desktop and phone, use the grocery list offline, and opt in to a daily "tonight's dinner" reminder.

## Tasks
1. **Manifest and icons:** `src/app/manifest.ts` (name, short name, theme and background colors from design tokens, `display: standalone`, start URL `/plan`), icons 192, 512, and maskable, Apple touch icon, splash-friendly colors.
2. **Service worker:** follow the Next.js PWA guide. Cache the app shell and the current grocery list for offline use (show an "Offline, changes will sync" banner; queue check-offs and replay when online). Ask before adding a library such as Serwist.
3. **Install experience:** an "Install app" button that uses `beforeinstallprompt` on Chrome/Edge/Android; on iOS Safari, a short "Share > Add to Home Screen" guide; hide when already installed (`display-mode: standalone`). Add a "Get the app" section to the landing page.
4. **Email reminders (Resend):** Settings toggle + time; daily cron finds users whose reminder time has arrived (their timezone) and sends "Tonight: Chicken stir-fry, 30 min" with a link to `/today`. Also send "Your plan for next week is ready" from the Phase 07 auto-draft. Add `RESEND_API_KEY` to env schema.
5. **Web push:** generate VAPID keys (document command), `push_subscriptions` table with RLS (new migration), subscribe/unsubscribe in Settings, send with `web-push` from the same cron. Handle expired subscriptions.
6. **Checks:** Lighthouse installability passes on a production build; test install on desktop Chrome and Android Chrome.

## Finish
Update `docs/PROGRESS.md` with human steps (Resend domain verification, VAPID keys in Vercel). Commit. Manual test steps for install, offline list, email, and push.
