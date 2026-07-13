import { test, expect } from "@playwright/test"

const TABS = ["build", "plans", "advisor", "knowledge", "transfer"] as const

test("app loads and the AMONTY header renders", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator(".brand").first()).toBeVisible()
  // The build tab is active by default (its panel ships with the `active` class).
  await expect(page.locator("#panel-build")).toBeVisible()
})

test("all five sidebar tabs switch to their panel", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("#panel-build")).toBeVisible()

  for (const tab of TABS) {
    // The tab handler (switchTab) lives in a script injected on mount, so the
    // first click may land before it wires up. Retry click+assert until it does.
    await expect(async () => {
      await page.locator(`.sidebar-tab[data-tab="${tab}"]`).click()
      await expect(page.locator(`#panel-${tab}`)).toHaveClass(/active/, {
        timeout: 1000,
      })
    }).toPass({ timeout: 15_000 })

    await expect(page.locator(`#panel-${tab}`)).toBeVisible()
  }
})
