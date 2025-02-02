import {expect, test} from "@playwright/test";
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


  test('Change number mode', async ({page}) => {

    const app = new App(page)

    await app.goto('/')
    await app.searchFor('cat')
    await app.expectSymbolResult('@')
    await app.expectSymbolResult('À')

    await app.changeNumberMode('HTML - Hex')
    await app.expectSymbolResult('&#x40;')
    await app.expectSymbolResult('&commat;')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('HTML - Decimal')
    await app.expectSymbolResult('&#64;')
    await app.expectSymbolResult('&#128005;')
    await app.expectSymbolResult('&commat;')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('JSON and Javascript')
    await app.expectSymbolResult('"@"')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('CSS Property Values')
    await app.expectSymbolResult('\\000040')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();

    await app.changeNumberMode('Windows Alt Keys')
    await app.expectSymbolResult('À')
    await app.expectSymbolResult('Alt+0192')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('URL Encoding - %N')
    await app.expectSymbolResult('%40')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();


    await app.changeNumberMode('Unicode - U+0000')
    await app.expectSymbolResult('U+40')
    await app.expectSymbolResult('U+1f405')
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('None')
    await expect(app.page.getByText('U+40')).toBeHidden();
    await expect(app.page.getByText('U+1f405')).toBeHidden();
    await expect(app.page.getByText('&#x40;')).toBeHidden();
    await expect(app.page.getByText('%40')).toBeHidden();
    await expect(app.page.getByText('&#64;')).toBeHidden();
    await expect(app.page.getByText('&commat;')).toBeHidden();
    await expect(app.page.getByText('"@"')).toBeHidden();
    await expect(app.page.getByText('Alt+0192')).toBeHidden();
    await expect(app.page.getByText('\\000040')).toBeHidden();

    await app.changeNumberMode('HTML - Hex')

  })
})
