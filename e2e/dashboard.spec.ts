import { test, expect } from '@playwright/test';

test.describe('Personalized Content Dashboard E2E Tests', () => {
  test('Flow 1: Landing page renders header, interests, trending carousel, and feed', async ({ page }) => {
    await page.goto('/');

    // Check header logo and branding
    await expect(page.locator('text=AuraFeed')).toBeVisible();

    // Check greeting & personalized hero
    await expect(page.locator('text=Personalized Sanctuary')).toBeVisible();

    // Check active interests bar
    await expect(page.locator('text=Active Interests')).toBeVisible();

    // Check trending carousel
    await expect(page.locator('text=Trending Across All Realms')).toBeVisible();

    // Check unified feed indicator
    await expect(page.locator('text=Your Unified Feed')).toBeVisible();
    await expect(page.locator('text=Drag cards to reorder your feed')).toBeVisible();
  });

  test('Flow 2: Global debounced search opens and displays grouped results', async ({ page }) => {
    await page.goto('/');

    // Click search trigger in header
    await page.click('button:has-text("Search news, movies, music")');

    // Search dialog opens
    const searchInput = page.locator('input[placeholder*="Search news, movies, music"]');
    await expect(searchInput).toBeVisible();

    // Type query "Kyoto"
    await searchInput.fill('Kyoto');

    // Wait for debounced search execution
    await expect(page.locator('text=Autumn in Kyoto')).toBeVisible({ timeout: 5000 });
  });

  test('Flow 3: User can favorite content and view in Favorites section', async ({ page }) => {
    await page.goto('/');

    // Click first favorite button on any card
    const firstFavBtn = page.locator('button[aria-label="Add to favorites"]').first();
    await firstFavBtn.click();

    // Navigate to favorites page
    await page.goto('/favorites');

    // Verify favorite item is present
    await expect(page.locator('text=Your Saved Favorites')).toBeVisible();
    await expect(page.locator('text=No favorites saved yet')).not.toBeVisible();
  });

  test('Flow 4: Preferences settings can toggle categories', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.locator('text=Preferences & Feed Customization')).toBeVisible();
    await expect(page.locator('text=Select Content Realms')).toBeVisible();

    // Toggle a realm
    const sportsCard = page.locator('text=Sports & Adventure');
    await sportsCard.click();

    // Verify live saved feedback
    await expect(page.locator('text=Saved live')).toBeVisible();
  });
});
