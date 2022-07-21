import { expect, Page } from '@playwright/test'

const PAGE_LOAD_TIMEOUT_MS = 15000

class Shared {
  constructor (readonly page: Page) {
  }

  async expectClipboardContents (expected: string) {
    const content = await this.page.evaluate('navigator.clipboard.readText()')

    return expect(content).toEqual(expected)
  }

  async expectVisibleText (text: string) {
    return expect(this.page.locator(`text=${text}`).first()).toBeVisible()
  }

}

export class App extends Shared {

  constructor (page: Page) {
    super(page)
  }

  async goto (path = '/') {
    await this.page.goto(path, { timeout: PAGE_LOAD_TIMEOUT_MS })

    if (path === '/') {
      await expect(this.page).toHaveTitle('Discover Unicode Character Entities & Symbols | Amp What')
      await expect(this.page.locator('text=' + 'Andrew J. Peterson.').first()).toBeVisible()
      await expect(this.page.locator('text=' + 'All Rights Reserved').first()).toBeVisible()
    }

    return new Promise(resolve => setTimeout(resolve, 500))
  }

  async gotoLandingPage (q: string) {
    return this.page.goto(`/unicode/search/${encodeURIComponent(q)}`, { timeout: PAGE_LOAD_TIMEOUT_MS })

  }

  async clickLink (s: string) {
    return this.page.locator(`a:text-is("${s}")`).click()
  }

  async clickLinkWithTitle (s: string) {
    return this.page.locator('a[title="' + s + '"]').click()
  }

  async searchFor (q: string, modifier?: 'slowly') {
    const Q_SELECTOR = '[placeholder="type to search"]'
    await this.page.focus(Q_SELECTOR)
    await this.page.fill(Q_SELECTOR, '')
    return this.page.type(Q_SELECTOR,
      q,
      {
        delay:   modifier === 'slowly' ? 200 : 1,
        timeout: (5000 + (modifier === 'slowly' ? q.length * 250 : 0))
      })
  }

  async expectPath (p: string) {
    return this.page.waitForURL(p)
  }

  async expectPageTitleContains (s: string) {
    expect(await this.page.title()).toContain(s)
  }

  async viewDetails (s: string) {
    await this.expectSymbolResult(s)
    await this.page.locator(`text="${s}"`).click()
    await this.page.keyboard.press(' ')
    return new DetailView(this.page)
  }

  async viewDetailsForResultNumber (index: number) {
    await this.page.press('#q', 'Tab')
    while (--index)
      await this.page.keyboard.press('ArrowRight')
    await this.page.keyboard.press(' ')
    return new DetailView(this.page)
  }

  async expectVisibleElement (text: string) {
    const selector = `text="${text}"`
    await this.page.locator(selector).first().scrollIntoViewIfNeeded()
    return expect(this.page.locator(selector).first()).toBeVisible()
  }

  async expectSymbolResult (str: string, option: null | 'scrollTo' = null) {
    const selector = `text="${str}"`
    if (option === 'scrollTo')
      await this.page.locator(selector).first().scrollIntoViewIfNeeded()
    return expect(this.page.locator(selector).first()).toBeVisible()
  }

  async expectCharacterResult (str: string) {
    return expect(this.page.locator(`text=${str}`).first()).toBeVisible()
  }

  async clickShowMore () {
    return this.page.locator('text=' + 'Click to show more than 250.').click()
  }

  async clickAboutAmpWhat () {
    await this.clickLink('About Amp What')
    return new AboutPage(this.page)
  }

  async visitAboutPage () {
    this.goto('/about.html')
    return new AboutPage(this.page)
  }

  async clickElement (s: string) {
    return this.page.locator(`text="${s}"`).first().click()
  }

  async clickHelpLink () {
    return this.page.locator('a[title="View Help"]').click()
  }

  async expectCurrentQuery (expectedQ: string) {
    const actualQ = await this.page.$eval('#q', (el: HTMLInputElement) => el.value)
    expect(actualQ.replace('\\\\', '\\').toLowerCase()).toEqual(expectedQ.toLowerCase())
  }
}

export class AboutPage extends Shared {
  constructor (page: Page) {
    super(page)
  }

  async expectedContent () {
    await expect(this.page.locator('text=' + 'HTML character entities').first()).toBeVisible()
    await expect(this.page.locator('text=' + 'Unicode characters').first()).toBeVisible()
    await expect(this.page.locator('text=' + 'W3').first()).toBeVisible()
    await expect(this.page.locator('text=' + '/Latest\\s+Unicode\\.org\\s+international\\s+character\\s+reference/').first()).toBeVisible()

    await this.expectVisibleText('discoverable')
    return this.expectVisibleText('fun')
  }

}

export class DetailView extends Shared {

  constructor (page: Page) {
    super(page)
  }

  async clickSymbol () {
    return this.page.locator(`#modal samp`).first().click()
  }

  async clickNumber () {
    return this.page.locator(`#modal span.num:visible`).first().click()
  }

  async expectVisibleElement (elemText: string) {
    return expect(this.page.locator(`#modal-scroll >> text="${elemText}"`).first()).toBeVisible()
  }

  async clickLink (linkText: string) {
    return this.page.locator(`#modal-scroll >> text=${linkText}`).click()
  }

  async exitDetails () {
    return await this.page.keyboard.press('Escape')
  }

  async clickToCopy (text: string) {
    await this.page.locator(`#modal-scroll >> text=${text}`).click()
    return expect(this.page.locator(`text=${text} copied.`).first()).toBeVisible()
  }
}




