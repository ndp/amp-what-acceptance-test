import {test} from '@playwright/test'
import {App} from './page-objects/app'
import {expectedMatchesFor} from './data/util'


test.describe('Sample queries', () => {

  test('clicking yields expected results', async ({page}) => {

    const app = new App(page)
    await app.goto('/')

    const links = app.page.locator('#hints a[href^="/unicode/search"]')

    const count = await links.count()

    const indices = shuffledIndices(count)
    for (const i of indices) {
      const link = links.nth(i)

      const href = await link.getAttribute('href')
      const tail = href!.replace('/unicode/search/', '')
      const q = decodeURIComponent(tail)

      const title = await link.getAttribute('title')
      await app.clickLinkWithTitle(title!)
      await app.expectPath('/unicode/search/' + encodeURIComponent(q))

      for (const match of expectedMatchesFor(q))
        await app.expectCharacterResult(match)
    }

  })

})





function shuffledIndices(count: number): number[] {
  const arr: number[] = Array.from({ length: count }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
