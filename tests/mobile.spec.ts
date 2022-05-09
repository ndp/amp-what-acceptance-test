import { test } from '@playwright/test'
import { App } from './page-objects/app'

test.describe('Mobile', () => {
  test('Visit Amp-What on a small screen', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')

// * Emulate "iPhone 6"
    await app.searchFor('money', 'slowly')
    await app.expectPageTitleContains('money')
    await app.expectSymbolResult('$')
    await app.expectSymbolResult('💶')
    await app.expectSymbolResult('🤑')
    const details = await app.viewDetails('🤑')
    details.expectVisibleElement('money-mouth face')
    details.clickLink('supplemental symbols and pictographs')
    await app.expectSymbolResult('🤎')
    await app.expectSymbolResult('🧶')

  })

})