import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const authDir = resolve("tests/e2e/.auth");
const storageStatePath = resolve(authDir, "user.json");
const devProjectUrl = "https://ptvdczmwkwqkxlintzri.supabase.co";
const email = "playwright-meal-planner@local.test";
const password = "Playwright-only-password-2026";

export default async function globalSetup() {
  loadEnvConfig(process.cwd());
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !publishableKey || !secretKey) {
    console.warn(
      "Skipping authenticated E2E setup: Supabase development credentials are unavailable.",
    );
    return;
  }
  if (url !== devProjectUrl) {
    throw new Error(
      "Refusing E2E user provisioning outside the documented Supabase development project.",
    );
  }

  const admin = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: users, error: listError } = await admin.auth.admin.listUsers({
    perPage: 100,
  });
  if (listError) throw listError;
  const existing = users.users.find((user) => user.email === email);
  const userId =
    existing?.id ||
    (
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
    ).data.user?.id;
  if (!userId) throw new Error("Could not provision the Playwright test user.");
  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });
  if (updateError) throw updateError;

  const browserClient = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error: signInError } =
    await browserClient.auth.signInWithPassword({ email, password });
  if (signInError || !data.session)
    throw signInError || new Error("No E2E session returned.");

  mkdirSync(authDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const hostname = new URL(
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
  ).hostname;
  const projectRef = new URL(url).hostname.split(".")[0];
  const value = `base64-${Buffer.from(JSON.stringify(data.session)).toString("base64url")}`;
  await context.addCookies([
    {
      name: `sb-${projectRef}-auth-token`,
      value,
      domain: hostname,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  await context.storageState({ path: storageStatePath });
  await browser.close();
}
