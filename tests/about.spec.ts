import { test } from '@playwright/test'
import { App } from './page-objects/app'

test.describe('AmpWhat about page', () => {
  test('make sure it is available', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    const aboutPage = await app.clickAboutAmpWhat()
    return aboutPage.expectedContent()
  })

  test('visit URL directly', async ({ page }) => {
    const app = new App(page)
    const aboutPage = await app.visitAboutPage()
    return aboutPage.expectedContent()
  })
})
