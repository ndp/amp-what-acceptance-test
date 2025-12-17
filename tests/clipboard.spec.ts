import { test } from '@playwright/test'
import { Spa } from './page-objects/spa'


test.describe('AmpWhat.com clipboard', () => {

  test('Copy symbol inside details view', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/', { resetClipboard: true })
    await app.searchFor('zombie')
    const details = await app.viewDetails('&#129503;')
    await details.expectClipboardContents('')
    await details.clickSymbol()
    await details.expectVisibleText('🧟 copied')
    await details.expectClipboardContents('🧟')
  })

  test('Copy with "C" inside details view', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/', { resetClipboard: true })
    await app.searchFor('dog')
    const details = await app.viewDetails('𓃡')
    await details.expectClipboardContents('')
    await page.press('#modal', 'C')
    await details.expectVisibleText('𓃡 copied')
    await details.expectClipboardContents('𓃡')
  })

  test('Copy number inside details view', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/', { resetClipboard: true })
    await app.searchFor('zombie')
    const details = await app.viewDetails('&#129503;')
    await app.expectClipboardContents('')
    await details.clickNumber()
    await details.expectVisibleText('copied')
    await details.expectClipboardContents('&#129503;')
  })

  test('Copy symbol in grid view using clicks', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/', { resetClipboard: true })
    await app.searchFor('horse')
    await page.press('#q', 'Tab')
    await app.expectClipboardContents('')
    await app.clickElement('🎠')
    await app.clickElement('🎠')
    await app.expectVisibleText('copied')
    await app.expectClipboardContents('🎠')
  })

  test('Copy symbol in grid view using keyboard', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/', { resetClipboard: true })
    await app.searchFor('horse')
    await app.expectClipboardContents('')
    await page.press('#q', 'Tab')
    await app.clickElement('horse face')
    await page.press('#results', 'C')
    await app.expectVisibleText('copied')
    await app.expectClipboardContents('🐴')
  })
})

