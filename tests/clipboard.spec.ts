import { test } from '@playwright/test'
import { App } from './page-objects/app'


test.describe('AmpWhat.com clipboard', () => {

  test('Copy symbol inside details view', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('zombie')
    const details = await app.viewDetails('&#129503;')
    await details.clickSymbol()
    await app.expectVisibleText('🧟 copied')
    await app.expectClipboardContents('🧟')
  })

  test('Copy number inside details view', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('zombie')
    const details = await app.viewDetails('&#129503;')
    await details.clickNumber()
    await app.expectVisibleText('copied')
    await app.expectClipboardContents('&#129503;')
  })
  test('Copy symbol in grid view using clicks', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('horse')
    page.press('#q', 'Tab')
    await app.clickElement('🎠')
    await app.clickElement('🎠')
    await app.expectVisibleText('copied')
    await app.expectClipboardContents('🎠')
  })
  test('Copy symbol in grid view using keyboard', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('horse')
    await page.press('#q', 'Tab')
    await app.clickElement('horse face')
    await page.press('#results', 'C')
    await app.expectVisibleText('copied')
    await app.expectClipboardContents('🐴')
  })
})

