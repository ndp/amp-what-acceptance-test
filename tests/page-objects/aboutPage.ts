import {Shared} from "./shared";
import {expect, Page} from "@playwright/test";

export class AboutPage extends Shared {
  private inDialog: boolean;

  constructor(page: Page, inDialog = false) {
    super(page)
    this.inDialog = inDialog;
  }

  get context() {
    return this.inDialog ? this.page.locator('#modal-scroll') : this.page
  }

  async expectedContent() {
    await expect(this.context.getByRole('heading', {name: 'About AmpWhat'})).toBeVisible()
    await expect(this.context.getByText('AmpWhat is a quick,')).toBeVisible()
    await expect(this.context.getByText('Unicode characters')).toBeVisible()
    await expect(this.context.getByRole('link', {name: 'W3, “HTML entities”'})).toBeVisible()
    await expect(this.context.getByRole('link', {name: 'An Interaction from NDP Software'})).toBeVisible()
    await expect(this.context.getByRole('link', {
      name: 'Unicode.org, “Latest Unicode.org\n' +
        '    international\n' +
        '    character reference”'
    })).toBeVisible()
    await expect(this.page.getByText(/Latest\s+Unicode\.org\s+international\s+character\s+reference/)).toBeVisible({})

    await expect(this.context.getByText('discoverable')).toBeVisible({})
    return expect(this.context.getByText('and fun')).toBeVisible({})
  }

}
