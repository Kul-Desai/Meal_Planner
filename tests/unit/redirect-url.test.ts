import { describe, expect, it } from "vitest";
import { getAuthCallbackUrl } from "@/lib/auth/redirect-url";

describe("getAuthCallbackUrl", () => {
  it("uses the current production origin", () => {
    const requestHeaders = new Headers({
      origin: "https://meal-planner.example.com",
    });

    expect(getAuthCallbackUrl(requestHeaders, "http://localhost:3000")).toBe(
      "https://meal-planner.example.com/auth/callback",
    );
  });

  it("uses forwarded preview deployment headers when Origin is unavailable", () => {
    const requestHeaders = new Headers({
      "x-forwarded-proto": "https",
      "x-forwarded-host": "meal-planner-pr-1.vercel.app",
    });

    expect(getAuthCallbackUrl(requestHeaders, "http://localhost:3000")).toBe(
      "https://meal-planner-pr-1.vercel.app/auth/callback",
    );
  });

  it("falls back to the configured localhost site URL", () => {
    expect(getAuthCallbackUrl(new Headers(), "http://localhost:3000")).toBe(
      "http://localhost:3000/auth/callback",
    );
  });
});
