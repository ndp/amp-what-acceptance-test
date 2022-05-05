import { test } from '@playwright/test'
import { App } from './page-objects/app'
import * as fs from 'fs'
import path from 'path'

const queries = fs.readFileSync(path.resolve(__dirname, '../steps/top-1000-queries.csv'))
const expectedMatches = require(path.resolve(__dirname, '../steps/expected-results.json'))


test.describe('Top Queries', () => {

  const qs = queries.toString().split('\n').slice(0, 60).map(q => q.trim())

  for (const q of qs) {

    const match = expectedMatches[q.toLowerCase()] || q

    test(`Landing page for "${q}" has "${match}" character`, async ({ page }) => {
      const app = new App(page)
      await app.gotoLandingPage(q)
      await app.expectCurrentQuery(q)
      await app.expectSymbolResult(match)
    })

    test(`Search for "${q}" shows "${match}" character`, async ({ page }) => {
      const app = new App(page)
      await app.goto('/')
      await app.searchFor(q)
      await app.expectCurrentQuery(q)
      await app.expectSymbolResult(match)
    })
  }
})


