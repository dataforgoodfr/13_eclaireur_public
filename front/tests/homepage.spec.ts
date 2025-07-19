import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load the homepage and display main elements', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Check that the main title is visible
        await expect(page.getByRole('heading', { name: 'ÉCLAIREUR PUBLIC' })).toBeVisible();

        // Check that the subtitle is present
        await expect(page.getByText('La plateforme citoyenne pour rendre transparentes et accessibles les dépenses publiques des collectivités locales.')).toBeVisible();

        // Check that the search bar is present
        await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('should have correct page title', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');

        // Check the page title (you may need to adjust this based on your actual title)
        await expect(page).toHaveTitle(/ÉCLAIREUR PUBLIC/);
    });

    test('should display search functionality', async ({ page }) => {
        await page.goto('/');

        // Find the search input
        const searchInput = page.locator('input[type="text"]');
        await expect(searchInput).toBeVisible();

        // Test that we can type in the search input
        await searchInput.fill('test search');
        await expect(searchInput).toHaveValue('test search');
    });

    test('should have responsive layout', async ({ page }) => {
        await page.goto('/');

        // Check that the main container is present
        await expect(page.locator('.global-margin')).toBeVisible();

        // Check that the header background is applied
        await expect(page.locator('.bg-homepage-header')).toBeVisible();
    });
});
