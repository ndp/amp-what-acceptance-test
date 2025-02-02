import {test} from "@playwright/test";
import {App} from "./page-objects/app";

test.describe('Features', () => {
  test('Forward and back', async ({page}) => {
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
  test('Load More', async ({page}) => {
    const app = new App(page)

    await app.goto('/')
    await app.searchFor('bracket')
    await app.expectSymbolResult('tortoise shell bracketed latin capital letter s')
    await app.expectNoTextMatching('tortoise shell bracketed cjk unified ideograph-6557')

    await app.clickLink('Load 60k characters')
    await app.expectVisibleText('60727 Unicode characters loaded', {timeout: 10000})
    await app.expectSymbolResult('tortoise shell bracketed latin capital letter s', {scrollTo: true, timeout: 10000})
    await app.expectSymbolResult('tortoise shell bracketed cjk unified ideograph-6557')
    await app.searchFor('esperanto')
    await app.expectSymbolResult('Ĉ')
    await app.expectSymbolResult('ĉ')
    await app.expectSymbolResult('ŭ')

  })
})
