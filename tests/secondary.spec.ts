import { test } from '@playwright/test'
import { App } from './page-objects/app'

test.describe('AmpWhat about page', () => {
  test('make sure it is available', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    const aboutPage = await app.clickAboutAmpWhat()
    return aboutPage.expectedContent()
  })

  test('visit URL directly', async ({ page }) => {
    const app = new App(page)
    const aboutPage = await app.visitAboutPage()
    return aboutPage.expectedContent()
  })
})


test.describe('Help', () => {
  test('Using the help page modal', async ({ page }) => {
    const app = new App(page)
    await app.goto('/')

    await app.clickHelpLink()

    await app.clickLink('hiragana')
    await app.expectSymbolResult('hiragana letter a')

    await app.clickHelpLink()
    await app.clickLink('raqu')
    await app.expectSymbolResult('&raquo;')

    await app.clickHelpLink()
    await app.clickLink('2665')
    await app.expectSymbolResult('heart suit')

    await app.clickHelpLink()
    await app.clickLink('icon')
    await app.expectSymbolResult('optical disc icon')

    await app.clickHelpLink()
    await app.clickLink('weather')
    await app.expectSymbolResult('umbrella')
    await app.expectSymbolResult('thermometer')
    await app.expectSymbolResult('black sun rays')

    await app.clickHelpLink()
    await app.clickLink('pig')
    await app.expectSymbolResult('pig')

    await app.clickHelpLink()
    await app.clickLink('ligature')
    await app.expectSymbolResult('cyrillic capital ligature ie')

    await app.clickHelpLink()
    await app.clickLink('latin ligature')
    await app.expectSymbolResult('latin small ligature ff')

    await app.clickHelpLink()
    await app.clickLink('/note|music/ (♫)')
    await app.expectSymbolResult('quarter note')
    await app.expectSymbolResult('music flat sign')
    await app.expectSymbolResult('beamed sixteenth notes')
  })

  test('Using the help page', async ({ page }) => {
    const app = new App(page)

    await app.goto('/help.html')

    await app.clickLink('hiragana')
    await app.expectSymbolResult('hiragana letter a')

    await app.goto('/help.html')
    await app.clickLink('raqu')
    await app.expectSymbolResult('&raquo;')

    await app.goto('/help.html')
    await app.clickLink('2665')
    await app.expectSymbolResult('heart suit')

    await app.goto('/help.html')
    await app.clickLink('icon')
    await app.expectSymbolResult('optical disc icon')

    await app.goto('/help.html')
    await app.clickLink('weather')
    await app.expectSymbolResult('umbrella')
    await app.expectSymbolResult('thermometer')
    await app.expectSymbolResult('black sun rays')

  })
})

