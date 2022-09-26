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
      await app.expectVisibleElement('nazar amulet')
    })

    test('Trying out the the sample queries', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')

      await app.clickLinkWithTitle('quotes')
      await app.expectCharacterResult('&quot;')
      await app.expectCharacterResult('&apos;')
      await app.expectCharacterResult('fullwidth quotation mark')

      await app.clickLink('♕')
      await app.expectPath('/unicode/search/chess')
      await app.expectCharacterResult('black chess rook')
      await app.expectCharacterResult('white chess rook')
      await app.expectCharacterResult('question mark')
      await app.expectCharacterResult('&quest;')
      await app.expectCharacterResult('exclamation mark')
      await app.expectCharacterResult('double exclamation mark')
// * The query box contains "chess"

      await app.clickLinkWithTitle('greater than')
      await app.expectCharacterResult('greater-than sign')
      await app.expectCharacterResult('right-pointing double angle quotation mark')

      await app.clickLink('>')
      await app.expectCharacterResult('right-pointing double angle quotation mark')

      await app.clickLink('/')
      await app.expectCharacterResult('&frac14;')
      await app.expectCharacterResult('&frac34;')
      await app.expectCharacterResult('&frac13;')
      await app.expectCharacterResult('&frac23;')
      await app.expectCharacterResult('percent sign')

      await app.clickLinkWithTitle('weather')
      await app.expectCharacterResult('snowman')

      await app.clickLink('▲')
      await app.expectCharacterResult('right triangle')

      await app.clickLink('◼')
      await app.expectCharacterResult('black square')
      await app.expectCharacterResult('◼')

      await app.clickLinkWithTitle('person')
      await app.expectCharacterResult('swimmer')
      await app.expectCharacterResult('surfer')
      await app.expectCharacterResult('man in tuxedo')
      await app.expectCharacterResult('adult')
      await app.expectCharacterResult('shrug')

      await app.clickLinkWithTitle('car')
      // await app.expectCharacterResult('tram')
      await app.expectCharacterResult('tram car')
      await app.expectCharacterResult('police car')
      await app.expectCharacterResult('automobile')

      await app.clickLinkWithTitle('face')
      await app.expectCharacterResult('white frowning face')
      await app.expectCharacterResult('white smiling face')

      await app.clickLinkWithTitle('tick')
      await app.expectCharacterResult('white heavy check mark')
      await app.expectCharacterResult('ticket')
      await app.expectCharacterResult('apostrophe')

      await app.clickLinkWithTitle('rock')
      await app.expectCharacterResult('curling stone')

      await app.clickLinkWithTitle('paper')
      await app.expectCharacterResult('wastebasket')

      await app.clickLinkWithTitle('scissors')
      await app.expectCharacterResult('black scissors')

      await app.clickLinkWithTitle('danger')
      await app.expectCharacterResult('high voltage sign')

      await app.clickLinkWithTitle('love')
      await app.expectCharacterResult('two hearts')

      await app.clickLinkWithTitle('computer')
      await app.expectCharacterResult('keyboard')
      await app.expectCharacterResult('dvd')
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
      await app.expectSymbolResult('pirate flag')
      await app.expectSymbolResult('rainbow flag')
      await app.expectSymbolResult('white flag')
      await app.expectSymbolResult('&#127462;&#127466;')
      await app.expectSymbolResult('crossed flags') // in show more!
      const details = await app.viewDetails('&#127462;&#127466;')
      await details.expectVisibleElement('united arab emirates')

      await app.goto('/')
      await app.searchFor('&#127462;&#127466;')
      const details2 = await app.viewDetails('&#127462;&#127466;')
      await details2.expectVisibleElement('united arab emirates')
    })

    test('Forward and back', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor('esperanto')
      await app.expectSymbolResult('ŭ')
      await app.expectPath('/unicode/search/esperanto')
      await app.searchFor('EMOJI')
      await app.expectSymbolResult('😈')
      await app.expectPath('/unicode/search/emoji')
      await page.goBack()
      await app.expectSymbolResult('ŭ')
      await app.expectPath('/unicode/search/esperanto')
      await page.goForward()
      await app.expectSymbolResult('😈')
      await app.expectPath('/unicode/search/emoji')
    })
    test('Load More', async ({ page }) => {
      const app = new App(page)

      await app.goto('/')
      await app.searchFor('bracket')
      await app.expectSymbolResult('tortoise shell bracketed latin capital letter s')
      await app.clickLink('Load 55k characters')
      await app.expectVisibleText('55405 Unicode characters loaded')
      await app.expectSymbolResult('tortoise shell bracketed latin capital letter s')
      await app.expectSymbolResult('tortoise shell bracketed cjk unified ideograph-6557')
      await app.searchFor('esperanto')
      await app.expectSymbolResult('Ĉ')
      await app.expectSymbolResult('ĉ')
      await app.expectSymbolResult('ŭ')

    })
    test('query with no matches', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor('yabba dabba doo')
      await app.expectVisibleText('No matches.')
      await app.goto('/')
    })

    test('Keyboard navigation', async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor('money', 'slowly')
      await app.expectPageTitleContains('money')
      await app.expectSymbolResult('$')
      await app.expectSymbolResult('💶')
      await app.expectSymbolResult('🤑')
      const details = await app.viewDetailsForResultNumber(15)
      await details.expectVisibleElement('money-mouth face')
      await details.clickToCopy('supplemental symbols and pictographs')
    })

  }
)
