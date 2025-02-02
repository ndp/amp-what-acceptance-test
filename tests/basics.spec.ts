import { test } from '@playwright/test'
import { App } from './page-objects/app'

test.describe('AmpWhat.com basics', () => {

    test('A typical first visit', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.expectVisibleText('Andrew J. Peterson.')
      await app.expectVisibleText('All Rights Reserved')
      await app.searchFor('money')
      await app.expectPageTitleContains('money')
      await app.expectSymbolResult('$')
      await app.expectSymbolResult('credit card')
      await app.expectSymbolResult('banknote euro sign')
      await app.expectSymbolResult('banknote yen sign')
      await app.expectSymbolResult('banknote dollar sign')

      const details = await app.viewDetails('money-mouth face')
      await details.clickToCopy('supplemental symbols and pictographs')
      await details.exitDetails()

      await app.searchFor('supplemental symbols and pictographs')
      await app.expectVisibleElement('circled cross formee four dots')
      await app.expectVisibleElement('brown heart')

      await app.clickShowMore()
      return app.expectVisibleElement('nazar amulet', { timeout: 10000})
    })


    test('Visiting a search results page from an external link', async ({ page }) => {
      const app = new App(page)
      await app.goto('/unicode/search/currency')
      await app.expectCharacterResult('$')
      await app.expectCharacterResult('₤')
      await app.expectCharacterResult('💶')

    })


    test('Searching for a really long string', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor('right-pointing double angle quotation mark', 'slowly')
      await app.expectCharacterResult('right-pointing double angle quotation mark')
    })


    test('Unicode sequences', async ({ page }) => {
      const app = new App(page)

      await app.goto('/')
      await app.searchFor('medium-light skin tone')
      await app.expectSymbolResult('person bouncing ball')
      await app.expectSymbolResult('person gesturing ok')
      await app.expectSymbolResult('mx claus')

      await app.searchFor('flag')
      await app.clickShowMore()
      await app.expectSymbolResult('pirate flag', {scrollTo: true})
      await app.expectSymbolResult('rainbow flag')
      await app.expectSymbolResult('white flag')
      await app.expectSymbolResult('&#127462;&#127466;')
      await app.expectSymbolResult('crossed flags') // in show more!
      const details = await app.viewDetails('&#127462;&#127466;')
      await details.expectVisibleElement('united arab emirates flag')

      await app.goto('/')
      await app.searchFor('&#127462;&#127466;')
      const details2 = await app.viewDetails('&#127462;&#127466;')
      await details2.expectVisibleElement('united arab emirates flag')
    })

    test('query with no matches', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor('yabba dabba doo')
      await app.expectVisibleText('No matches.')
      await app.goto('/')
    })

  }
)
