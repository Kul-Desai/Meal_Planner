import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env";

const protectedPaths = [
  "/onboarding",
  "/plan",
  "/today",
  "/groceries",
  "/meals",
  "/settings",
];

export async function updateSession(request: NextRequest) {
  const env = getPublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isProtected = protectedPaths.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
