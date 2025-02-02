import {expect, Page, test} from '@playwright/test'
import {Shared} from "./shared";
import {DetailView} from "./detailView";
import {AboutPage} from "./aboutPage";

const PAGE_LOAD_TIMEOUT_MS = 15000

test.beforeEach(async ({page}) => {
  await page.route(/googletagmanager|rollbar|google-analytics|adtraffic|doubleclick|googlesyndication/,
    async (route, _request) => {
    // console.log('aborted URL: ', request.url())
    await route.abort()
  })
})

export class App extends Shared {

  constructor(page: Page) {
    super(page)
  }

  async goto(path = '/', options: { resetClipboard?: boolean } = {}) {
    await this.page.goto(path, {timeout: PAGE_LOAD_TIMEOUT_MS})

    if (path === '/') {
      await expect(this.page).toHaveTitle('Discover Unicode Character Entities & Symbols | AmpWhat')
    }

    await expect(this.page.getByText('Andrew J. Peterson')).toBeVisible()
    await expect(this.page.getByText('All Rights Reserved')).toBeVisible()

    if (options.resetClipboard) {
      await this.page.evaluate('navigator.clipboard.writeText("")')
      await this.expectClipboardContents('')
    }

    return
    // return new Promise(resolve => setTimeout(resolve, 500))
  }

  async gotoLandingPage(q: string) {
    return this.page.goto(`/unicode/search/${encodeURIComponent(q)}`, {timeout: PAGE_LOAD_TIMEOUT_MS})

  }

  async clickLink(s: string) {
    return this.page.locator(`a:text-is("${s}")`).click()
  }

  async clickLinkWithTitle(s: string) {
    return this.page.locator('a[title="' + s + '"]').click()
  }

  async searchFor(
    q: string,
    modifier?: 'normal' | 'slowly' = 'normal'
  ) {
    const locator = this.qLocator
    await locator.fill('')


    if (q.length === 1) {
      await locator.press(q)
    } else {
      const timeout = 5000 + q.length * (modifier === 'slowly' ? 400 : 100)
    await locator.pressSequentially(
      q,
      {
        delay: modifier === 'slowly' ? 200 : 20,
        timeout
      })
    }
  }

  async expectPath(p: string) {
    return this.page.waitForFunction(expectedPath => document.location.pathname === expectedPath, p, {
      polling: 250,
      timeout: 5000
    })
  }

  async expectPageTitleContains(s: string) {
    expect(await this.page.title()).toContain(s)
  }

  async viewDetails(s: string): Promise<DetailView> {
    await this.expectSymbolResult(s, {scrollTo: true})
    await this.page.getByText(s, {exact: true}).click()
    await this.page.keyboard.press(' ')
    await this.page.waitForSelector('#modal-scroll', {state: 'visible'})
    return new DetailView(this.page)
  }

  async viewDetailsForResultNumber(index: number) {
    await this.page.press('#q', 'Tab')
    while (--index)
      await this.page.keyboard.press('ArrowRight')
    await this.page.keyboard.press(' ')
    return new DetailView(this.page)
  }

  async expectVisibleElement(text: string, options?: { timeout?: number }) {
    const locator = this.page.getByText(text, {exact: true})
    return expect(locator).toBeVisible(options)
  }

  async expectSymbolResult(str: string, options?: { scrollTo?: boolean, timeout?: number }) {
    const locator = this.page.getByText(str).locator('visible=true').first()
    if (options?.scrollTo)
      await locator.scrollIntoViewIfNeeded()
    return expect(locator).toBeVisible(options)
  }

  async expectCharacterResult(str: string, options?: { scrollTo?: boolean, timeout?: number }) {
    const locator = this.page.getByText(str).locator('visible=true').first()

    if (options?.scrollTo)
      await locator.scrollIntoViewIfNeeded()
    return expect(locator).toBeVisible(options)
  }

  async expectNoTextMatching(str: string) {
    return expect(this.page.locator('body')).not.toContainText(str)
  }

  async clickShowMore() {
    return this.page.getByText('Click to show more than 250.').click()
  }

  async clickAboutAmpWhat() {
    await this.clickLink('About AmpWhat')
    return new AboutPage(this.page, {inDialog: true})
  }

  async visitAboutPage() {
    await this.goto('/about.html')
    return new AboutPage(this.page)
  }

  async clickElement(s: string) {
    return this.page.getByText(s).first().click()
  }

  async clickHelpLink() {
    return this.page.locator('a[title="View Help"]').click()
  }

  async expectCurrentQuery(expectedQ: string) {
    const _actualQ = await this.page.$eval('#q', (el: HTMLInputElement) => el.value)
    const actualQ = _actualQ.replace('\\\\', '\\').toLowerCase()
    expect(actualQ).toEqual(expectedQ.toLowerCase())
  }
}




