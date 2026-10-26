import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { chromium } from "@playwright/test";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const authDir = resolve("tests/e2e/.auth");
const storageStatePath = resolve(authDir, "user.json");
const devProjectUrl = "https://ptvdczmwkwqkxlintzri.supabase.co";
const email = "playwright-meal-planner@local.test";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

function toPlaywrightCookie(
  cookie: PendingCookie,
  hostname: string,
): {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
} {
  const { options } = cookie;
  const expires =
    options.expires instanceof Date
      ? Math.floor(options.expires.getTime() / 1000)
      : options.maxAge === undefined
        ? undefined
        : Math.floor(Date.now() / 1000) + options.maxAge;

  return {
    name: cookie.name,
    value: cookie.value,
    domain: options.domain || hostname,
    path: options.path || "/",
    ...(expires === undefined ? {} : { expires }),
    httpOnly: options.httpOnly ?? false,
    secure: options.secure ?? false,
    sameSite:
      options.sameSite === true || options.sameSite === "strict"
        ? "Strict"
        : options.sameSite === "none"
          ? "None"
          : "Lax",
  };
}

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
  const password = randomUUID();

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
        email_confirm: true,
      })
    ).data.user?.id;
  if (!userId) throw new Error("Could not provision the Playwright test user.");
  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });
  if (updateError) throw updateError;

  const pendingCookies: PendingCookie[] = [];
  const browserClient = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(cookies) {
        pendingCookies.push(...cookies);
      },
    },
  });
  const { error: signInError } = await browserClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) throw signInError;
  if (!pendingCookies.length)
    throw new Error("No E2E cookies returned from the SSR client.");

  mkdirSync(authDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const hostname = new URL(
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
  ).hostname;
  await context.addCookies(
    pendingCookies.map((cookie) => toPlaywrightCookie(cookie, hostname)),
  );
  await context.storageState({ path: storageStatePath });
  await browser.close();
}
