import { expect, test } from "@playwright/test";

test.use({ storageState: "tests/e2e/.auth/user.json" });

test("a signed-in user completes onboarding and does not return to it", async ({
  page,
}) => {
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(
    page.getByRole("heading", { name: "What are you in the mood for?" }),
  ).toBeVisible();

  for (let index = 0; index < 8; index += 1) {
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await expect(
    page.getByRole("heading", { name: "Your plan is ready to build" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Plan my week" }).click();
  await expect(page).toHaveURL(/\/plan$/);

  await page.goto("/plan");
  await expect(page).toHaveURL(/\/plan$/);
  await expect(
    page.getByRole("heading", { name: /Good morning,/ }),
  ).toBeVisible();
});
