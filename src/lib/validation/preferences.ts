import { z } from "zod";
import {
  allergyValues,
  dietValues,
  moodValues,
  proteinValues,
  proteinsForDiet,
} from "@/config/preferences";
import { isIanaTimeZone } from "@/lib/preferences/timezone";

const trimmedDislike = z.string().trim().min(1).max(80);

export function normalizeDislikes(dislikes: readonly string[]) {
  const seen = new Set<string>();
  return dislikes.reduce<string[]>((result, dislike) => {
    const value = dislike.trim().replace(/\s+/g, " ");
    const key = value.toLocaleLowerCase();
    if (value && !seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
    return result;
  }, []);
}

export const timeZoneSchema = z
  .string()
  .trim()
  .min(1, "Choose a valid time zone.")
  .refine(isIanaTimeZone, "Choose a valid time zone.");

const rawPreferenceSchema = z.object({
  mood_tags: z.array(z.enum(moodValues)).min(1).max(3),
  cooking_days: z
    .array(
      z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
    )
    .min(1)
    .max(7),
  household_size: z.number().int().min(1).max(6),
  has_kids: z.boolean(),
  diet: z.enum(dietValues),
  allergies: z.array(z.enum(allergyValues)).max(allergyValues.length),
  protein_likes: z
    .array(z.enum(proteinValues))
    .min(1)
    .max(proteinValues.length),
  dislikes: z.array(trimmedDislike).max(50),
  max_minutes_weekday: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  max_minutes_weekend: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  timezone: timeZoneSchema,
});

export const preferenceInputSchema = rawPreferenceSchema
  .superRefine((values, context) => {
    if (new Set(values.cooking_days).size !== values.cooking_days.length) {
      context.addIssue({
        code: "custom",
        path: ["cooking_days"],
        message: "Choose each day once.",
      });
    }
    if (new Set(values.allergies).size !== values.allergies.length) {
      context.addIssue({
        code: "custom",
        path: ["allergies"],
        message: "Choose each allergy once.",
      });
    }
    if (new Set(values.protein_likes).size !== values.protein_likes.length) {
      context.addIssue({
        code: "custom",
        path: ["protein_likes"],
        message: "Choose each protein once.",
      });
    }
    const compatible = new Set(
      proteinsForDiet(values.diet).map((option) => option.value),
    );
    if (values.protein_likes.some((protein) => !compatible.has(protein))) {
      context.addIssue({
        code: "custom",
        path: ["protein_likes"],
        message: "Choose proteins that fit your dietary needs.",
      });
    }
    if (normalizeDislikes(values.dislikes).length !== values.dislikes.length) {
      context.addIssue({
        code: "custom",
        path: ["dislikes"],
        message: "Each dislike should be listed once.",
      });
    }
  })
  .transform((values) => ({
    ...values,
    dislikes: normalizeDislikes(values.dislikes),
  }));

export type PreferenceValues = z.output<typeof preferenceInputSchema>;
