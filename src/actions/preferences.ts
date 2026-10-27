"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { preferenceInputSchema } from "@/lib/validation/preferences";

type PreferenceResult = { ok: true; data: null } | { ok: false; error: string };

async function savePreferences(
  input: unknown,
  completeOnboarding: boolean,
): Promise<PreferenceResult> {
  const parsed = preferenceInputSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Check your preferences and try again." };

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return { ok: false, error: "Sign in to save your preferences." };

  const { timezone, ...preferences } = parsed.data;
  const { data: savedPreferences, error: preferencesError } = await supabase
    .from("preferences")
    .update(preferences)
    .eq("user_id", user.id)
    .select("user_id")
    .maybeSingle();
  if (preferencesError || !savedPreferences) {
    return {
      ok: false,
      error: "Your preferences could not be saved. Try again.",
    };
  }

  const profileUpdate = completeOnboarding
    ? { timezone, onboarding_completed_at: new Date().toISOString() }
    : { timezone };
  const { data: savedProfile, error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("user_id", user.id)
    .select("user_id")
    .maybeSingle();
  if (profileError || !savedProfile) {
    return {
      ok: false,
      error: "Your time zone could not be saved. Try again.",
    };
  }

  revalidatePath("/plan");
  revalidatePath("/settings");
  revalidatePath("/onboarding");
  return { ok: true, data: null };
}

export async function completeOnboarding(input: unknown) {
  return await savePreferences(input, true);
}

export async function updatePreferences(input: unknown) {
  return await savePreferences(input, false);
}
