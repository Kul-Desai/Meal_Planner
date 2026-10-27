# Distribution: How People Get the App

> **Current focus (2026-10-26): web app only.** People use it in a desktop or mobile browser at the live URL. The desktop app comes later, after the web app is complete; the planned route is the installable PWA in section 2 (Later 2), with a native desktop wrapper considered only if the PWA falls short.

One Next.js codebase. Google Play was dropped on 2026-10-26, so the plan is the web app plus the installable PWA, with iOS as an optional later step.

## Summary

| Path | What the user does | Cost | Effort | When |
|------|-------------------|------|--------|------|
| 1. Web app on Vercel | Opens a URL on any device | Free to start (Vercel Hobby is for non-commercial use; move to Pro before charging) | Already built | Phase 1 onward |
| 2. Installable app (PWA) | Clicks "Install" in Chrome/Edge on desktop, or "Add to Home Screen" on phone. Gets its own icon, window, and notifications | Free | Low | Phase 9 |
| 3. Google Play | Dropped | n/a | n/a | Not planned |
| 4. Apple App Store (Capacitor) | Downloads from App Store | $99 per year, Xcode on a Mac | Medium to high | Optional, after the web app shows traction |

## 1. Web app (Vercel)

Connect the GitHub repo to Vercel. Every push to `main` deploys production; every pull request gets a preview URL. This is also the backend for every other path, so nothing is wasted.

## 2. "Download from a website" for desktop = PWA

For desktop, a Progressive Web App gives you exactly the "download from our website" experience without building a separate desktop program:

- On Chrome or Edge (Windows, Mac, ChromeOS, Linux) an **Install** button appears; the app opens in its own window with a dock/taskbar icon.
- On Android, Chrome offers "Install app".
- On iPhone, Safari "Share > Add to Home Screen" installs it, and web push notifications work once installed (iOS 16.4+).
- Updates are instant: deploy and every user has the new version.

The landing page gets a clear **Get the app** section: Install button (desktop and Android), and Add to Home Screen instructions (iPhone).

What Next.js needs: `app/manifest.ts`, icons (192, 512, maskable), a service worker for offline grocery list and push, and an install prompt component. The Next.js docs have a PWA guide; Serwist is an optional helper library for caching.

**Native desktop installers (Electron/Tauri) are not recommended.** They add code signing costs, auto-update plumbing, and a second build pipeline, with no real benefit for a meal planner that needs to be online.

## 3. Google Play (dropped)

Not planned as of 2026-10-26. Android users get the same app by installing the PWA from Chrome ("Install app"), with its own icon, full-screen window, and notifications. If this is ever revisited, the approach would be a Trusted Web Activity built from the same site; the old Phase 11 prompt is in `docs/archive/`.

## 4. Apple App Store (optional, later)

Apple rejects apps that are just a website in a wrapper (thin wrappers). If you go here, use **Capacitor** in remote-URL mode and add real native value: native push notifications, home-screen widgets for "tonight's dinner", Siri shortcut, haptics, offline list. Needs the $99/year Apple Developer Program and Xcode (your MacBook works). Revisit after the web app shows traction.

## Auth notes across platforms

- Web and PWA: Supabase email and Google OAuth work unchanged (the redirect returns to your domain).
- Capacitor (iOS): needs deep links or a custom URL scheme for the OAuth callback. Plan for this only if Phase 12 happens.

## Domain

Buy a domain before Phase 9 (installed apps are tied to the origin; changing domains later means users reinstall).
