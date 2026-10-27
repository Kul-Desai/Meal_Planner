import { preferenceDefaults } from "@/config/preferences";
import type { Preference, Profile } from "@/lib/supabase/types";
import {
  preferenceInputSchema,
  type PreferenceValues,
} from "@/lib/validation/preferences";

export function preferenceValuesFromRows(
  preferences: Preference | null,
  profile: Pick<Profile, "timezone"> | null,
): PreferenceValues {
  return preferenceInputSchema.parse({
    mood_tags: preferences?.mood_tags.length
      ? preferences.mood_tags
      : preferenceDefaults.mood_tags,
    cooking_days: preferences?.cooking_days.length
      ? preferences.cooking_days
      : preferenceDefaults.cooking_days,
    household_size:
      preferences?.household_size ?? preferenceDefaults.household_size,
    has_kids: preferences?.has_kids ?? preferenceDefaults.has_kids,
    diet: preferences?.diet ?? preferenceDefaults.diet,
    allergies: preferences?.allergies ?? preferenceDefaults.allergies,
    protein_likes: preferences?.protein_likes.length
      ? preferences.protein_likes
      : preferenceDefaults.protein_likes,
    dislikes: preferences?.dislikes ?? preferenceDefaults.dislikes,
    max_minutes_weekday:
      preferences?.max_minutes_weekday ??
      preferenceDefaults.max_minutes_weekday,
    max_minutes_weekend:
      preferences?.max_minutes_weekend ??
      preferenceDefaults.max_minutes_weekend,
    timezone: profile?.timezone ?? "UTC",
  });
}
