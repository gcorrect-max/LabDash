import { test, expect } from '@playwright/test'

test.describe('Role-based Access Control', () => {
  test.describe('Admin user', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('admin@example.com')
      await page.getByLabel('Hasło').fill('admin123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/dashboard')
    })

    test('should have access to system pages', async ({ page }) => {
      await page.goto('/system/status')
      await expect(page).toHaveURL('/system/status')
      await expect(page.getByRole('heading', { name: 'Status systemu' })).toBeVisible()
    })

    test('should have access to system users', async ({ page }) => {
      await page.goto('/system/users')
      await expect(page).toHaveURL('/system/users')
      await expect(
        page.getByRole('heading', { name: 'Zarządzanie użytkownikami' })
      ).toBeVisible()
    })

    test('should have access to health page', async ({ page }) => {
      await page.goto('/health')
      await expect(page).toHaveURL('/health')
      await expect(page.getByRole('heading', { name: 'Health Check' })).toBeVisible()
    })

    test('should NOT have access to service tools (ziggy only)', async ({ page }) => {
      await page.goto('/service/tools')
      await expect(page).toHaveURL('/403')
    })
  })

  test.describe('Student user', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('student@example.com')
      await page.getByLabel('Hasło').fill('student123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/booking')
    })

    test('should have access to booking page', async ({ page }) => {
      await page.goto('/booking')
      await expect(page).toHaveURL('/booking')
      await expect(
        page.getByRole('heading', { name: 'Kalendarz rezerwacji' })
      ).toBeVisible()
    })

    test('should have access to dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/dashboard')
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    })

    test('should NOT have access to system status', async ({ page }) => {
      await page.goto('/system/status')
      await expect(page).toHaveURL('/403')
    })

    test('should NOT have access to reports', async ({ page }) => {
      await page.goto('/reports')
      await expect(page).toHaveURL('/403')
    })

    test('should NOT have access to booking admin', async ({ page }) => {
      await page.goto('/booking/admin')
      await expect(page).toHaveURL('/403')
    })
  })

  test.describe('Teacher user', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('teacher@example.com')
      await page.getByLabel('Hasło').fill('teacher123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/dashboard')
    })

    test('should have access to booking admin', async ({ page }) => {
      await page.goto('/booking/admin')
      await expect(page).toHaveURL('/booking/admin')
    })

    test('should have access to reports', async ({ page }) => {
      await page.goto('/reports')
      await expect(page).toHaveURL('/reports')
    })

    test('should NOT have access to reports export (admin/ziggy only)', async ({
      page,
    }) => {
      await page.goto('/reports/export')
      await expect(page).toHaveURL('/403')
    })

    test('should NOT have access to system pages', async ({ page }) => {
      await page.goto('/system/status')
      await expect(page).toHaveURL('/403')
    })
  })

  test.describe('Ziggy user', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill('ziggy@example.com')
      await page.getByLabel('Hasło').fill('ziggy123')
      await page.getByRole('button', { name: 'Zaloguj się' }).click()
      await expect(page).toHaveURL('/dashboard')
    })

    test('should have access to service tools', async ({ page }) => {
      await page.goto('/service/tools')
      await expect(page).toHaveURL('/service/tools')
      await expect(
        page.getByRole('heading', { name: 'Narzędzia serwisowe' })
      ).toBeVisible()
    })

    test('should have access to all system pages', async ({ page }) => {
      await page.goto('/system/status')
      await expect(page).toHaveURL('/system/status')

      await page.goto('/system/logs')
      await expect(page).toHaveURL('/system/logs')

      await page.goto('/system/users')
      await expect(page).toHaveURL('/system/users')
    })
  })
})
