# Meal Planner Playbook

This folder is the plan for the whole build. Codex builds; Claude directs and reviews; you decide and test.

## The files

| File | What it is |
|------|-----------|
| `README.md` | This guide: setup and the loop you repeat for every phase |
| `PRODUCT.md` | What the app does, screen by screen |
| `ARCHITECTURE.md` | Stack, folders, data model, AI pipeline, grocery engine, media |
| `ROADMAP.md` | Phases 00 to 12 with "done when" checklists |
| `DISTRIBUTION.md` | Web, installable app on desktop and phone, iOS (optional) |
| `DESIGN.md` | Dribbble + `frontend-design` workflow (Phase 08) |
| `PROGRESS.md` | Running log Codex updates after each phase |
| `codex/AGENTS.template.md` | Rules for Codex; becomes the root `AGENTS.md` in Step 0 |
| `codex/prompts/phase-XX-*.md` | The exact prompt for each Codex phase |

---

## Step 0: Setup (you, about 45 minutes)

### 0.1 Check tools
```bash
node -v          # needs v22 or newer. If not: nvm install 22 && nvm use 22 && nvm alias default 22
git --version
```
VS Code with the Codex extension signed in with your personal account.

### 0.2 Connect this folder to your GitHub repo
```bash
cd ~/Meal_Planner
git init -b main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git pull origin main          # skip if the GitHub repo is completely empty
```
If the pull brought down a `README.md`, move it out of the way (create-next-app refuses to run next to one):
```bash
mv README.md docs/REPO_README.md
```

### 0.3 Scaffold the Next.js app
```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
Accept the recommended defaults for any other question (say Yes to React Compiler and to AGENTS.md if asked). The `docs/` folder is allowed to exist; nothing in it is touched.

Then turn our Codex rules into the root `AGENTS.md` (this appends below the block Next.js generates):
```bash
cat docs/codex/AGENTS.template.md >> AGENTS.md
```

### 0.4 Install skills for Codex (project level, saved in `.agents/skills`)
```bash
npx skills add supabase/agent-skills -s supabase supabase-postgres-best-practices -a codex -y
npx skills add anthropics/skills -s frontend-design -a codex -y
npx skills add shadcn/ui -s shadcn -a codex -y
npx skills add vercel-labs/agent-skills -s web-design-guidelines vercel-react-best-practices -a codex -y
npx skills add vercel/next.js -s next-dev-loop -a codex -y
npm install -g agent-browser@^0.27      # browser tool used by next-dev-loop
npx skills list                         # should show 7 skills
```
Commit `.agents/` and `skills-lock.json` so the skills travel with the repo.

### 0.5 Create the Supabase development project
1. supabase.com > New project > name `meal-planner-dev`, region East US (closest to Maryland). Save the database password in your password manager.
2. Project Settings > API: copy the **Project URL**, **publishable key**, and **secret key**.
3. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=<project url>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
   SUPABASE_SECRET_KEY=<secret key>
   AI_PROVIDER=mock
   ```
4. Authentication > URL Configuration: Site URL `http://localhost:3000`; add redirect URL `http://localhost:3000/**`. (Vercel preview URLs get added in 0.7.)

Later you will create a second project, `meal-planner-prod`, in Phase 10. Codex's MCP only ever points at dev.

### 0.6 Connect Supabase MCP to Codex
Add to `~/.codex/config.toml` (replace `<dev-project-ref>`, the ID in your project URL):
```toml
[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=<dev-project-ref>&features=database,docs,development,debugging"
```
Then authenticate:
```bash
codex mcp login supabase       # if "codex" is not found: npm i -g @openai/codex
```
Test in Codex: "Use the Supabase MCP to list tables in my project." An empty list is a success.

### 0.7 Connect Vercel
1. vercel.com > Add New Project > import the GitHub repo.
2. Add the same env vars as `.env.local` (Production and Preview).
3. After the first deploy, add `https://*.vercel.app/**` (or your exact preview pattern) to Supabase redirect URLs.

### 0.8 First commit
```bash
git add -A
git commit -m "chore: scaffold Next.js app, Codex rules, skills, and project playbook"
git push -u origin main
```
Then tell Claude: **"Phase 00 done"**. Claude checks the folder before Phase 01 starts.

---

## The loop for every phase

1. **Start a fresh Codex chat** in VS Code (one chat per phase keeps context clean). Use high reasoning for phases 02, 04, 05.
2. **Paste:**
   ```
   Execute docs/codex/prompts/phase-01-foundation.md. Follow AGENTS.md. Show me your plan before writing code.
   ```
3. **Review the plan** Codex shows. If unsure, paste it to Claude.
4. **Let Codex build.** Approve commands it asks to run. It finishes by updating `docs/PROGRESS.md` and giving manual test steps.
5. **Test it yourself** with those steps at phone width (browser dev tools, 375px) and desktop.
6. **Ask Claude: "review phase 01".** Claude reads the code in this folder, checks it against the "done when" list and the rules, and gives you a fix prompt for Codex if anything is off.
7. **Push, open a PR, check the Vercel preview, merge.** Then move to the next phase.

If Codex gets stuck or goes in circles: stop it, copy the error and what it tried, and bring it to Claude. Do not let it rewrite large unrelated parts of the app.

## What you need when

| Phase | You need |
|-------|---------|
| 01 | Google Cloud OAuth client for Google sign-in (Codex will list exact steps) |
| 04 | An LLM API key (OpenAI or Anthropic) with a small spend limit set |
| 04b | ImageKit account (free) and image model access on your LLM provider |
| 08 | 8 to 15 Dribbble references saved in `docs/design/references/` and the brief in `DESIGN.md` |
| 09 | Resend account (email) |
| 10 | Domain name; Sentry and PostHog accounts |
