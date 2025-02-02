import { test } from '@playwright/test'
import { App } from './page-objects/app'
import * as fs from 'fs'
import path from 'path'
import {expectedMatchesFor} from './data/util'


const queries = fs.readFileSync(path.resolve(__dirname, './data/top-1000-queries.csv'))

test.describe('Top Queries', () => {

  const qs = queries
    .toString()
    .split('\n')
    .slice(0, 60)
    .map(q => q.trim())

  for (const q of qs) {

    const matches = expectedMatchesFor(q)

    for (const match of matches) {

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
  }

  test(`Landing page for "flag" has "flag in hole" character`, async ({ page }) => {
    const app = new App(page)
    await app.gotoLandingPage('flag')
    await app.expectCurrentQuery('flag')
    await app.clickShowMore()
    await app.expectSymbolResult('flag in hole')
  })

  test(`Search for "flag" shows "flag in hole" character`, async ({ page }) => {
    const app = new App(page)
    await app.goto('/')
    await app.searchFor('flag')
    await app.expectCurrentQuery('flag')
    await app.clickShowMore()
    await app.expectSymbolResult('flag in hole')
  })

})


