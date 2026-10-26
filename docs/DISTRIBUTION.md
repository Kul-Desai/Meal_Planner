# Distribution: How People Get the App

One Next.js codebase, four ways to reach users. Do them in this order; each step reuses the previous one.

## Summary

| Path | What the user does | Cost | Effort | When |
|------|-------------------|------|--------|------|
| 1. Web app on Vercel | Opens a URL on any device | Free to start (Vercel Hobby is for non-commercial use; move to Pro before charging) | Already built | Phase 1 onward |
| 2. Installable app (PWA) | Clicks "Install" in Chrome/Edge on desktop, or "Add to Home Screen" on phone. Gets its own icon, window, and notifications | Free | Low | Phase 9 |
| 3. Google Play (Trusted Web Activity) | Downloads from Play Store | $25 one-time developer fee | Low to medium, plus a 14-day testing window | Phase 11 |
| 4. Apple App Store (Capacitor) | Downloads from App Store | $99 per year, Xcode on a Mac | Medium to high | Optional, after Android traction |

## 1. Web app (Vercel)

Connect the GitHub repo to Vercel. Every push to `main` deploys production; every pull request gets a preview URL. This is also the backend for every other path, so nothing is wasted.

## 2. "Download from a website" for desktop = PWA

For desktop, a Progressive Web App gives you exactly the "download from our website" experience without building a separate desktop program:

- On Chrome or Edge (Windows, Mac, ChromeOS, Linux) an **Install** button appears; the app opens in its own window with a dock/taskbar icon.
- On Android, Chrome offers "Install app".
- On iPhone, Safari "Share > Add to Home Screen" installs it, and web push notifications work once installed (iOS 16.4+).
- Updates are instant: deploy and every user has the new version.

The landing page gets a clear **Get the app** section: Install button (desktop/Android), Add to Home Screen instructions (iPhone), and later the Play Store badge.

What Next.js needs: `app/manifest.ts`, icons (192, 512, maskable), a service worker for offline grocery list and push, and an install prompt component. The Next.js docs have a PWA guide; Serwist is an optional helper library for caching.

**Native desktop installers (Electron/Tauri) are not recommended.** They add code signing costs, auto-update plumbing, and a second build pipeline, with no real benefit for a meal planner that needs to be online.

## 3. Google Play via Trusted Web Activity (recommended for Android)

A Trusted Web Activity (TWA) packages your PWA as an Android app that runs in Chrome's engine, full screen, with no browser bar.

Why TWA instead of Capacitor for Android:
- Our app is server-rendered Next.js with server actions and a proxy. Capacitor wants a static bundle (`output: 'export'`), which removes those features, or a remote URL mode that is effectively a web view anyway.
- TWA keeps one codebase and ships updates without store review (the store app always loads your live site).
- Web push, offline support, and Google sign-in work the same as the PWA.

Steps (Phase 11):
1. Pass a Lighthouse PWA/installability check on the production URL.
2. Generate the Android project with **Bubblewrap CLI** (Google's tool) or **PWABuilder** (web UI that uses Bubblewrap).
3. Host `/.well-known/assetlinks.json` on your domain (Digital Asset Links) so Android trusts the site and hides the URL bar.
4. Create a Google Play developer account ($25). Upload the signed `.aab`.
5. **Closed testing rule:** personal developer accounts created after 13 Nov 2023 must run a closed test with at least **12 testers opted in for 14 consecutive days** before applying for production. Start recruiting classmates and friends early (a Smith School group chat works). An organization account (needs a D-U-N-S number) is not subject to this rule.
6. Play requirements to prepare in advance: privacy policy URL, data safety form, in-app **and** web-based account deletion, content rating questionnaire, screenshots and feature graphic.

## 4. Apple App Store (optional, later)

Apple rejects apps that are just a website in a wrapper (thin wrappers). If you go here, use **Capacitor** in remote-URL mode and add real native value: native push notifications, home-screen widgets for "tonight's dinner", Siri shortcut, haptics, offline list. Needs the $99/year Apple Developer Program and Xcode (your MacBook works). Revisit after Android shows traction.

## Auth notes across platforms

- Web/PWA/TWA: Supabase email and Google OAuth work unchanged (the redirect returns to your domain).
- Capacitor (iOS): needs deep links or a custom URL scheme for the OAuth callback. Plan for this only if Phase 12 happens.

## Domain

Buy a domain before Phase 9 (installable apps and assetlinks are tied to the origin; changing domains later means users reinstall).
