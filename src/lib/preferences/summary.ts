import {
  labelForOption,
  moodOptions,
  proteinOptions,
} from "@/config/preferences";
import type { PreferenceValues } from "@/lib/validation/preferences";

export function buildSummarySentence(values: PreferenceValues) {
  const days = values.cooking_days.length;
  const moods = values.mood_tags
    .map((mood) => labelForOption(moodOptions, mood).toLowerCase())
    .join(" and ");
  const proteins = values.protein_likes
    .slice(0, 2)
    .map((protein) => labelForOption(proteinOptions, protein).toLowerCase())
    .join(" and ");
  const proteinTail =
    values.protein_likes.length > 2
      ? ` and ${values.protein_likes.length - 2} more`
      : "";

  return `We’ll plan ${days} dinner${days === 1 ? "" : "s"} with ${moods} energy, using ${proteins}${proteinTail}.`;
}
