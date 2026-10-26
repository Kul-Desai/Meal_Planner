import { expect, test } from "@playwright/test";

test("redirects a signed-out visitor from plan to login", async ({ page }) => {
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
