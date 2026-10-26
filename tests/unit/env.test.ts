import { describe, expect, it } from "vitest";
import { parsePublicEnv, parseServerEnv } from "@/lib/env";

const publicValues = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

describe("environment validation", () => {
  it("parses the browser environment", () => {
    expect(parsePublicEnv(publicValues)).toEqual(publicValues);
  });

  it("lists invalid variables", () => {
    expect(() =>
      parseServerEnv({ ...publicValues, AI_PROVIDER: "unknown" }),
    ).toThrow("AI_PROVIDER");
  });
});
