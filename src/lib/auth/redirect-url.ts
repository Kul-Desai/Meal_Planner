import "server-only";

import { getServerEnv } from "@/lib/env";

export function getAuthCallbackUrl() {
  const env = getServerEnv();
  const base = env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : env.NEXT_PUBLIC_SITE_URL;
  return new URL("/auth/callback", base).toString();
}
