import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.describe('Admin user navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('admin@example.com')
      await page.getByLabel('Hasło').fill('admin123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display sidebar with navigation items', async ({ page }) => {
      // Check for main navigation items
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
      await expect(page.getByText('Rezerwacje')).toBeVisible()
      await expect(page.getByText('Raporty')).toBeVisible()
      await expect(page.getByText('System')).toBeVisible()
    })

    test('should navigate to booking calendar', async ({ page }) => {
      await page.getByText('Rezerwacje').click()
      await page.getByRole('link', { name: 'Kalendarz' }).click()
      await expect(page).toHaveURL('/booking')
    })

    test('should navigate to system status', async ({ page }) => {
      await page.getByText('System').click()
      await page.getByRole('link', { name: 'Status' }).click()
      await expect(page).toHaveURL('/system/status')
    })

    test('should highlight active navigation item', async ({ page }) => {
      const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
      await expect(dashboardLink).toHaveClass(/active/)
    })
  })

  test.describe('Student user navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('student@example.com')
      await page.getByLabel('Hasło').fill('student123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/booking')
    })

    test('should NOT display system navigation group', async ({ page }) => {
      await expect(page.getByText('System')).not.toBeVisible()
    })

    test('should NOT display reports navigation group', async ({ page }) => {
      await expect(page.getByText('Raporty')).not.toBeVisible()
    })

    test('should display booking navigation', async ({ page }) => {
      await expect(page.getByText('Rezerwacje')).toBeVisible()
    })

    test('should NOT display booking admin in navigation', async ({ page }) => {
      await page.getByText('Rezerwacje').click()
      // Kalendarz should be visible, but Zarządzanie should not
      await expect(page.getByRole('link', { name: 'Kalendarz' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Zarządzanie' })).not.toBeVisible()
    })
  })

  test.describe('404 page', () => {
    test('should display 404 page for unknown routes when not logged in', async ({
      page,
    }) => {
      await page.goto('/nonexistent-page')
      await expect(page.getByText('404')).toBeVisible()
      await expect(page.getByText('Strona nie znaleziona')).toBeVisible()
    })

    test('should display 404 page for unknown routes when logged in', async ({
      page,
    }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('admin@example.com')
      await page.getByLabel('Hasło').fill('admin123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/dashboard')

      await page.goto('/nonexistent-page')
      await expect(page.getByText('404')).toBeVisible()
    })
  })

  test.describe('403 page', () => {
    test('should display 403 page for unauthorized access', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('student@example.com')
      await page.getByLabel('Hasło').fill('student123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()

      await page.goto('/system/status')
      await expect(page).toHaveURL('/403')
      await expect(page.getByText('403')).toBeVisible()
      await expect(page.getByText('Brak dostępu')).toBeVisible()
    })
  })
})
