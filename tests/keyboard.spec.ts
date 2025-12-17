import {test} from "@playwright/test";
import {Spa} from "./page-objects/spa";

test.describe('Keyboard', () => {
  test('navigation', async ({page}) => {
    const app = new Spa(page)
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
