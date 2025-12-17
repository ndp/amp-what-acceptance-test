import { test } from '@playwright/test'
import { Spa } from './page-objects/spa'

test.describe('Mobile', () => {
  test('Visit AmpWhat on a small screen', async ({ page }) => {
    const app = new Spa(page)
    await app.goto('/')

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
