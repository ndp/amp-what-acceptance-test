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

    let settings = await app.openSettings()
    await settings.expectDataSet('default')
    await settings.close()

    await app.searchFor('bracket')
    await app.expectSymbolResult('tortoise shell bracketed latin capital letter s')
    await app.expectNoTextMatching('tortoise shell bracketed cjk unified ideograph-6557')


    settings = await app.openSettings()
    await settings.selectDataSet('large')
    await settings.close()

    await app.expectSymbolResult('tortoise shell bracketed latin capital letter s', {scrollTo: true, timeout: 10000})
    await app.expectSymbolResult('tortoise shell bracketed cjk unified ideograph-6557')

    settings = await app.openSettings()
    await settings.selectDataSet('default')
    await settings.close()

    await app.expectNoTextMatching('tortoise shell bracketed cjk unified ideograph-6557')

  })


  test('Change number mode', async ({page}) => {

    const app = new App(page)

    await app.goto('/')
    await app.searchFor('cat')
    await app.expectSymbolResult('@')
    await app.expectSymbolResult('À')

    await app.changeNumberMode('HTML - Hex')

    // Expect both number and symbolic values
    await app.expectSymbolResult('&#x40;')
    await app.expectSymbolResult('&commat;')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('HTML - Decimal')
    await app.expectSymbolResult('&#64;')
    await app.expectSymbolResult('&#128005;')
    await app.expectSymbolResult('&commat;')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('JSON and Javascript')
    await app.expectSymbolResult('"@"')
    // Make sure Unicode value don't sneak in (regresses bug)
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('CSS Property Values')
    await app.expectSymbolResult('\\000040')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')

    await app.changeNumberMode('Windows Alt Keys')
    await app.expectSymbolResult('À')
    await app.expectSymbolResult('Alt+0192')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('URL Encoding - %N')
    await app.expectSymbolResult('%40')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')


    await app.changeNumberMode('Unicode - U+0000')
    await app.expectSymbolResult('U+40')
    await app.expectSymbolResult('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('None')
    await app.expectHiddenText('U+40')
    await app.expectHiddenText('U+1f405')
    await app.expectHiddenText('&#x40;')
    await app.expectHiddenText('%40')
    await app.expectHiddenText('&#64;')
    await app.expectHiddenText('&commat;')
    await app.expectHiddenText('"@"')
    await app.expectHiddenText('Alt+0192')
    await app.expectHiddenText('\\000040')

    await app.changeNumberMode('HTML - Hex')

  })
})
