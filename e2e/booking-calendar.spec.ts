import { test, expect } from '@playwright/test'

const STORAGE_USER = {
  id: '3',
  name: 'Anna Nowak',
  email: 'student@example.com',
  role: 'student',
}

test('create booking via calendar UI (mock)', async ({ page }) => {
  // set mock auth in localStorage
  await page.goto('http://localhost:5173')
  await page.evaluate((user) => {
    localStorage.setItem('labdash_access_token', 'mock-token')
    localStorage.setItem('labdash_user', JSON.stringify(user))
  }, STORAGE_USER)

  await page.goto('http://localhost:5173/booking')
  await page.waitForSelector('text=Kalendarz rezerwacji', { timeout: 5000 }).catch(()=>{})

  // click add
  await page.click('text=Dodaj')
  await page.waitForSelector('text=Nowa rezerwacja')

  await page.fill('label:has-text("Temat") input', 'Testowe spotkanie')
  const now = new Date()
  const start = new Date(now.getTime() + 60*60*1000)
  const end = new Date(now.getTime() + 2*60*60*1000)
  const toLocalInput = (d: Date) => d.toISOString().slice(0,16)
  await page.fill('label:has-text("Start") input', toLocalInput(start))
  await page.fill('label:has-text("End") input', toLocalInput(end))
  await page.fill('label:has-text("Uczestnicy") input', 'student@example.com')

  await page.click('text=Zapisz')

  // expect event to appear in calendar
  await page.waitForSelector('text=Testowe spotkanie', { timeout: 5000 })
  const exists = await page.locator('text=Testowe spotkanie').count()
  expect(exists).toBeGreaterThan(0)
})
