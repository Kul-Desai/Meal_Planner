import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const callbackSchema = z.object({ code: z.string().min(1).nullable() });

export async function GET(request: NextRequest) {
  const parsed = callbackSchema.safeParse({
    code: request.nextUrl.searchParams.get("code"),
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?reason=link", request.url));
  }

  if (!parsed.data.code) {
    // Default email templates can return tokens in a URL fragment. The browser
    // carries that fragment across this redirect to the client completion page.
    return NextResponse.redirect(new URL("/auth/complete", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(
    parsed.data.code,
  );
  return NextResponse.redirect(
    new URL(error ? "/login?reason=link" : "/plan", request.url),
  );
}
