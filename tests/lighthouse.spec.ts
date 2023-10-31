import { playAudit } from 'playwright-lighthouse'
import { test } from '@playwright/test'
import playwright from 'playwright'

test.describe('Lighthouse audits', () => {

  let browser

  test.beforeAll(async () => {
    browser = await playwright['chromium'].launch({
      args: ['--remote-debugging-port=9222'],
    });
  })

  test.afterAll(async () => await browser.close())

  test('home page', async () => {
    const page = await browser.newPage();
    await page.goto('/');

    await playAudit({
      thresholds: {
        performance: 95,
        accessibility: 70,
        'best-practices': 80,
        seo: 100
      },
      page: page,
      port: 9222,
    });

  });
  test('cached page', async () => {
    const page = await browser.newPage();
    await page.goto('/unicode/search/money');

    await playAudit({
      thresholds: {
        performance: 95,
        accessibility: 70,
        'best-practices': 80,
        seo: 100
      },
      page: page,
      port: 9222,
    });

  });
  test('uncached page', async () => {
    const page = await browser.newPage();
    await page.goto('/unicode/search/red%20gift%20envelope');

    await playAudit({
      thresholds: {
        performance: 80,
        accessibility: 70,
        'best-practices': 80,
        seo: 100
      },
      page: page,
      port: 9222,
    });
  });
});
