import { test } from '@playwright/test'
import { App } from './page-objects/app'
import {expectedMatchesFor} from './data/util'


test.describe('AmpWhat.com links', () => {

  test('click through all sample queries', async ({ page }) => {

    const app = new App(page)
    await app.goto('/')

    const links = app.page.locator('#hints a[href^="/unicode/search"]')

    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)

      const href = await link.getAttribute('href')
      const title = await link.getAttribute('title')
      const q = decodeURIComponent(href.replace('/unicode/search/',''))

      await app.clickLinkWithTitle(title)
      await app.expectPath('/unicode/search/' + encodeURIComponent(q))

      for (const match of expectedMatchesFor(q))
        await app.expectCharacterResult(match)
    }

  })


})
