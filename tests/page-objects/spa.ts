import {expect, Page, test} from '@playwright/test'
import {Shared} from "./shared";
import {DetailView} from "./detailView";
import {AboutPage} from "./aboutPage";
import {Settings} from './settings'


test.beforeEach(async ({page}) => {
  await page.route(/googletagmanager|rollbar|google-analytics|adtraffic|doubleclick|googlesyndication/,
    async (route, _request) => {
    // console.log('aborted URL: ', request.url())
    await route.abort()
  })
})

export class Spa extends Shared {

  constructor(page: Page) {
    super(page)
  }

  async searchFor(
    q: string,
    modifier: 'normal' | 'slowly' = 'normal'
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


  async changeNumberMode(newMode:
                           'JSON and Javascript'
                           | 'HTML - Hex'
                           | 'HTML - Decimal'
                           | 'CSS Property Values'
                           | 'URL Encoding - %N'
                           | 'Windows Alt Keys'
                           | 'Unicode - U+0000'
                           | 'None') {
    const settings = await this.openSettings()
    await settings.page.selectOption('#change-mode', newMode)
    return settings.close()
  }

  async openSettings() {

    await this.page.evaluate(() => window.scrollTo(0, 0));

    await this.page.getByText('⛭').click()
    await expect(this.page.getByText('Close', {exact: true})).toBeVisible()

    return new Settings(this.page)
  }

}


