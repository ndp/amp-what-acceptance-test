import {Shared} from "./shared";
import {expect, Page} from "@playwright/test";

export class DetailView extends Shared {

  constructor(page: Page) {
    super(page)
  }

  async clickSymbol() {
    return this.page.locator(`#modal-scroll samp`).first().click()
  }

  async clickNumber() {
    return this.page.locator(`#modal-scroll span.num:visible`).first().click()
  }

  async expectVisibleElement(elemText: string) {
    return expect(this.page.locator(`#modal-scroll >> text="${elemText}"`).first()).toBeVisible()
  }

  async clickLink(linkText: string) {
    return this.page.locator(`#modal-scroll >> text=${linkText}`).click()
  }

  async exitDetails() {
    await this.page.keyboard.press('Escape')
    await expect(this.page.getByPlaceholder(this.Q_PLACEHOLDER)).toBeVisible()
  }

  async clickToCopy(text: string) {
    await this.page.locator(`#modal-scroll >> text="${text}"`).click()
    const expected = this.supportsCopyToClipboard() ? `${text} copied.` : 'Copy failed.';
    await expect(this.page.locator('css=div.floating-confirmation')).toHaveText(expected)
  }

  supportsCopyToClipboard(): boolean {
    // const project = test.info().project.name
    return true
  }
}
