import {expect, Page} from "@playwright/test";

export class Shared {

  Q_PLACEHOLDER = 'type to search';

  constructor(readonly page: Page) {
  }

  get qLocator() {
    return this.page.getByPlaceholder(this.Q_PLACEHOLDER)
  }

  async expectClipboardContents(expected: string) {
    const content = await this.page.evaluate('navigator.clipboard.readText()')
    return expect(content).toEqual(expected)
  }

  async expectVisibleText(text: string, options?: {
    timeout: number;
  } = {}) {
    return expect(this.page.getByText(text)).toBeVisible(options)
  }

  async scrollToTop() {
    return this.page.evaluate(() => window.scrollTo(0, 0))
  }

}
