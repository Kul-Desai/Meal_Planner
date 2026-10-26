import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const confirmSchema = z.object({
  token_hash: z.string().min(1),
  type: z.enum(["email", "magiclink", "signup"]),
});

export async function GET(request: NextRequest) {
  const parsed = confirmSchema.safeParse({
    token_hash: request.nextUrl.searchParams.get("token_hash"),
    type: request.nextUrl.searchParams.get("type"),
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?reason=link", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp(parsed.data);
  return NextResponse.redirect(
    new URL(error ? "/login?reason=link" : "/plan", request.url),
  );
}
