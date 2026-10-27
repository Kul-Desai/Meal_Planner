import { describe, expect, it } from "vitest";
import { preferenceDefaults } from "@/config/preferences";
import { buildSummarySentence } from "@/lib/preferences/summary";
import { formatTimeZone, isIanaTimeZone } from "@/lib/preferences/timezone";
import {
  normalizeDislikes,
  preferenceInputSchema,
} from "@/lib/validation/preferences";

const validPreferences = {
  ...preferenceDefaults,
  mood_tags: ["speedy"],
  protein_likes: ["chicken", "tofu"],
  timezone: "America/New_York",
};

describe("preferences validation", () => {
  it("normalizes and de-duplicates dislikes", () => {
    expect(
      normalizeDislikes([" Mushrooms ", "mushrooms", "Red   onion"]),
    ).toEqual(["Mushrooms", "Red onion"]);
  });

  it("rejects duplicate dislikes and diet-conflicting proteins", () => {
    expect(
      preferenceInputSchema.safeParse({
        ...validPreferences,
        diet: "vegan",
        protein_likes: ["chicken", "tofu"],
        dislikes: ["mushrooms", "Mushrooms"],
      }).success,
    ).toBe(false);
  });

  it("accepts valid browser IANA time zones and rejects invalid values", () => {
    expect(isIanaTimeZone("America/New_York")).toBe(true);
    expect(isIanaTimeZone("Eastern Time")).toBe(false);
    expect(preferenceInputSchema.safeParse(validPreferences).success).toBe(
      true,
    );
  });
});

describe("preference copy", () => {
  it("builds a useful plan summary", () => {
    const parsed = preferenceInputSchema.parse(validPreferences);
    expect(buildSummarySentence(parsed)).toContain("5 dinners");
    expect(buildSummarySentence(parsed)).toContain("speedy meals");
  });

  it("formats a DST-stable friendly time zone label", () => {
    expect(formatTimeZone("America/New_York")).toBe("Eastern Time (New York)");
  });
});
