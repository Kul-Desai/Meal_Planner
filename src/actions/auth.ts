"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getAuthCallbackUrl } from "@/lib/auth/redirect-url";
import { createClient } from "@/lib/supabase/server";

type AuthResult<T> = { ok: true; data: T } | { ok: false; error: string };

const emailSchema = z.object({ email: z.email() });
const googleSchema = z.object({ provider: z.literal("google") });
const signOutSchema = z.object({ intent: z.literal("sign-out") });

export async function sendMagicLink(
  input: unknown,
): Promise<AuthResult<{ sent: boolean }>> {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Enter a valid email address." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return { ok: true, data: { sent: false } };

  const callbackUrl = getAuthCallbackUrl(await headers());
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: callbackUrl },
  });
  if (error)
    return { ok: false, error: "Could not send a link. Try again shortly." };
  return { ok: true, data: { sent: true } };
}

export async function beginGoogleSignIn(
  input: unknown,
): Promise<AuthResult<{ url: string }>> {
  const parsed = googleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid sign-in request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return { ok: true, data: { url: "/plan" } };

  const callbackUrl = getAuthCallbackUrl(await headers());
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: parsed.data.provider,
    options: { redirectTo: callbackUrl },
  });
  if (error || !data.url) {
    return {
      ok: false,
      error: "Google sign-in is unavailable. Try again later.",
    };
  }
  return { ok: true, data: { url: data.url } };
}

export async function signOut(input: unknown): Promise<AuthResult<null>> {
  const parsed = signOutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid sign-out request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You are already signed out." };

  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: "Could not sign out. Try again." };
  return { ok: true, data: null };
}
