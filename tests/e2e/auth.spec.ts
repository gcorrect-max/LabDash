import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL('/login')
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'LabDash' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Hasło')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Hasło').fill('wrongpassword')
    await page.getByRole('button', { name: 'Zaloguj się' }).click()

    await expect(page.getByText('Nieprawidłowy email lub hasło')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Hasło').fill('admin123')
    await page.getByRole('button', { name: 'Zaloguj się' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should login successfully with student credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('student@example.com')
    await page.getByLabel('Hasło').fill('student123')
    await page.getByRole('button', { name: 'Zaloguj się' }).click()

    // Student should be redirected to /booking by default
    await expect(page).toHaveURL('/booking')
  })

  test('should logout and redirect to login', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Hasło').fill('admin123')
    await page.getByRole('button', { name: 'Zaloguj się' }).click()
    await expect(page).toHaveURL('/dashboard')

    // Then logout
    await page.getByRole('button', { name: 'Wyloguj' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should persist session on page refresh', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Hasło').fill('admin123')
    await page.getByRole('button', { name: 'Zaloguj się' }).click()
    await expect(page).toHaveURL('/dashboard')

    // Refresh the page
    await page.reload()

    // Should still be on dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should redirect unauthenticated user from protected route to login', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
