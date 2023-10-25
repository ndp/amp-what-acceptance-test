import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import { configure } from 'ts-envs'


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();


const envs = configure({
  ci: {
    type: 'boolean',
    required: false,
    default: false,
    description: 'running as part of automated continuous integration'
  },
  host: {
    default: 'amp-what.com',
    required: false,
    description: 'domain to test against'
  },
  https: {
    type: 'boolean', default: true,
    required: false,
    description: 'whether site is served via https (instead of http)'
  },
  workers: {
    type: 'integer',
    default: 0,
    description: 'number of workers running tests. 0 sets automatically'
  }
})

// console.log(envs.helpText)
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 80 * 1000,
  expect:  {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 8000
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: envs.ci,
  /* Retry on CI only */
  // retries: envs.ci ? 2 : 0,
  retries: 3,
  /* Opt out of parallel tests on CI: envs.ci ? 1 : undefined */
  workers: envs.workers || 0.5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 8000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http${envs.https ? 's' : ''}://${envs.host}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace:      'on-first-retry',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  /* https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json */
  projects: [
    {
      name: 'chromium',
      testIgnore: /(mobile).spec.ts/, // not supported
      use:  {
        permissions: ['clipboard-read'],
        ...devices['Desktop Chrome']
      }
    },

    {
      name:       'firefox',
      testIgnore: /(clipboard|mobile|top-queries).spec.ts/, // not supported
      use:        {
        ...devices['Desktop Firefox']
      }
    },
    {
      name:      'Mobile Chrome',
      testMatch: /mobile.spec.ts/,
      use:       {
        ...devices['Pixel 5']
      }
    },
    {
      name:      'Mobile Safari',
      testMatch: /mobile.spec.ts/,
      use:       {
        ...devices['iPhone 12']
      }
    },
    {
      name:      'Mobile Safari (landscape)',
      testMatch: /mobile.spec.ts/,
      use:       {
        ...devices['iPhone 12 landscape']
      }
    }
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/'

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
