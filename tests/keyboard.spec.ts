import {test} from "@playwright/test";
import {App} from "./page-objects/app";

test.describe('Keyboard', () => {
  test('navigation', async ({page}) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('money', 'slowly')
    await app.expectPageTitleContains('money')
    await app.expectSymbolResult('$')
    await app.expectSymbolResult('💶')
    await app.expectSymbolResult('🤑')
    const details = await app.viewDetailsForResultNumber(18)
    await details.expectVisibleElement('money-mouth face')
    await details.clickToCopy('paid')
  })
})
