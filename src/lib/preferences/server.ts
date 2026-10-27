import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getAccountPreferences(userId: string) {
  const supabase = await createClient();
  const [
    { data: profile, error: profileError },
    { data: preferences, error: preferencesError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, display_name, timezone, onboarding_completed_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (profileError || preferencesError)
    return { profile: null, preferences: null };
  return { profile, preferences };
}
