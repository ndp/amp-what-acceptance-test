import {Shared} from './shared'
import {expect} from '@playwright/test'

export class Settings extends Shared {

  async expectDataSet(size: 'default' | 'large') {
    const radioButton = this.page.locator(`input[type="radio"][name="dataset"][value="${size}"]`);
    await expect(radioButton).toBeVisible()
    await expect(radioButton).toBeChecked()
  }

  async selectDataSet(size: 'default' | 'large') {
    const radioButton = this.page.locator(`input[type="radio"][name="dataset"][value="${size}"]`);
    await radioButton.click()
    await this.expectVisibleText(' Unicode characters loaded')
  }

  async close() {
    await this.page.getByText('Close', {exact: true}).click()
    await expect(this.page.getByText('Close', {exact: true})).toBeHidden()
  }
}
