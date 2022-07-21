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
    await details.expectVisibleElement('money-mouth face')
    await details.clickToCopy('supplemental symbols and pictographs')
    await details.exitDetails()
    await app.searchFor('supplemental symbols and pictographs')
    await app.expectSymbolResult('🤎')
    return app.expectSymbolResult('🧶')
  })

})
