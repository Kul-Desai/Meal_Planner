import { getPublicEnv } from "@/lib/env";

function getForwardedValue(requestHeaders: Headers, name: string) {
  return requestHeaders.get(name)?.split(",")[0]?.trim();
}

function getRequestOrigin(requestHeaders: Headers) {
  const origin = getForwardedValue(requestHeaders, "origin");
  if (origin) {
    try {
      return new URL(origin).origin;
    } catch {
      // Fall through to trusted proxy headers or the configured site URL.
    }
  }

  const host = getForwardedValue(requestHeaders, "x-forwarded-host");
  if (!host) return undefined;

  const protocol =
    getForwardedValue(requestHeaders, "x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
}

export function getAuthCallbackUrl(
  requestHeaders: Headers,
  fallbackOrigin = getPublicEnv().NEXT_PUBLIC_SITE_URL,
) {
  const base = getRequestOrigin(requestHeaders) || fallbackOrigin;
  return new URL("/auth/callback", base).toString();
}
