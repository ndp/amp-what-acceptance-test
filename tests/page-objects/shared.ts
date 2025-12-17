import {expect, Page, test} from "@playwright/test";

export class Shared {

  Q_PLACEHOLDER = 'type to search';

  constructor(readonly page: Page) {
  }

  get qLocator() {
    return this.page.getByPlaceholder(this.Q_PLACEHOLDER)
  }

  async expectClipboardContents(expected: string) {
    try {
      const content = await this.page.evaluate('navigator.clipboard.readText()')
      return expect(content).toEqual(expected)
    } catch (e) {
      if (e instanceof Error && e.message.includes('NotAllowedError')) {
        test.skip(true, 'Clipboard access not allowed in this environment')
      }
      throw e
    }
  }

  async expectVisibleText(text: string, options: {
    timeout?: number;
  } = {}) {
    return expect(this.page.getByText(text)).toBeVisible(options)
  }

  async expectHiddenText(text: string) {
    return expect(this.page.getByText(text)).toBeHidden()
  }

  async scrollToTop() {
    return this.page.evaluate(() => window.scrollTo(0, 0))
  }

  supportsCopyToClipboard(): boolean {
    return true
  }

  async goto(path = '/', options: { resetClipboard?: boolean|string } = {}) {
    await this.page.goto(path)

    if (path === '/') {
      await expect(this.page).toHaveTitle('Discover Unicode Character Entities & Symbols | AmpWhat')
    }

    await expect(this.page.getByText('Andrew J. Peterson')).toBeVisible()
    await expect(this.page.getByText('All Rights Reserved')).toBeVisible()

    if (options.resetClipboard) {
      const clipboardText = options.resetClipboard === true ? '' : options.resetClipboard
      await this.page.evaluate(`navigator.clipboard.writeText("${clipboardText}")`)
      await this.expectClipboardContents(clipboardText)
    }

    return
  }

  async gotoLandingPage(q: string) {
    return this.page.goto(`/unicode/search/${encodeURIComponent(q)}`)
  }

  async clickLink(s: string) {
    return this.page.locator(`a:text-is("${s}")`).click()
  }

  async clickLinkWithTitle(s: string) {
    return this.page.locator('a[title="' + s + '"]').click()
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


  async expectVisibleElement(text: string, options?: { timeout?: number }) {
    const locator = this.page.getByText(text, {exact: true})
    return expect(locator).toBeVisible(options)
  }

  async expectNoTextMatching(str: string) {
    return expect(this.page.locator('body')).not.toContainText(str)
  }

}
