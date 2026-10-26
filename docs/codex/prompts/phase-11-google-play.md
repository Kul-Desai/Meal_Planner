# Phase 11: Google Play (Trusted Web Activity)

**Branch:** `phase-11-google-play`
**Read first:** `AGENTS.md`, `docs/DISTRIBUTION.md` section 3, `docs/ROADMAP.md` Phase 11.

Start recruiting 12 or more testers at the beginning of this phase; the 14 consecutive days are the slowest part.

## Codex tasks
1. Verify the production site passes PWA installability and that `/today` loads fast on a mid-range Android phone profile.
2. Create `android/` using Bubblewrap CLI (`@bubblewrap/cli`) from the production manifest: package id (ask me), app name, colors, icons, splash, notification delegation enabled, Play billing off.
3. Serve `/.well-known/assetlinks.json` from the Next.js app with the SHA-256 fingerprint(s) of the upload key and the Play App Signing key (placeholders until I paste them).
4. Document the signing key creation and backup steps; never commit keystores (add to `.gitignore`).
5. Produce store listing drafts in `docs/store/`: short description (80 chars), full description, feature list, screenshot shot list (phone and 7-inch tablet), data safety form answers based on what the app actually collects.
6. Write the human checklist in `docs/PROGRESS.md`: create Play developer account, create app, upload `.aab` to closed testing, add tester emails or a Google Group, keep testers opted in for 14 days, complete content rating and data safety, then apply for production.

## Finish
Update `docs/PROGRESS.md`. Commit. Explain how to update the app later (web deploys update content instantly; rebuild the `.aab` only when manifest, icons, or Android settings change).
