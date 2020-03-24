/* globals gauge*/
"use strict"
const {
        clear,
        click,
        closeBrowser,
        currentURL,
        focus,
        goto,
        openBrowser,
        press,
        screenshot,
        text,
        textBox,
        toRightOf,
        write,
      }        = require('taiko')
const assert   = require("assert")
const headless = process.env.headless_chrome.toLowerCase() === 'true'

beforeSuite(async () => {
  await openBrowser({ headless: headless })
})

afterSuite(async () => {
  await closeBrowser()
})

gauge.screenshotFn = async function () {
  return await screenshot({ encoding: 'base64' })
}

step("Search for <query>", async (query) => {
  await clear()
  await write(query)
})

step("Page contains <content>", async (content) => {
  assert.ok(await text(content).exists())
})

step("Visit amp-what", async function () {
  await goto('http://amp-what.com/')
})

step("Visit <arg0>", async function (path) {
  await goto(`http://ampwhat.com${path}`)
})

step("I see the <content> symbol", async function (content) {
  assert.ok(await text(content).exists())
})

step("I see the <content> character", async function (content) {
  assert.ok(await text(content).exists())
})

step("Click link <arg0>", async function (text) {
  await click(text)
})

step("I see the description <arg0>", async function (content) {
  assert.ok(await text(content).exists())
})

step("The URL is now <arg0>", async function (arg0) {
  const url = await currentURL()
  assert.equal(arg0, url.replace('www.', ''))
})

step("The query box contains <arg0>", async function (arg0) {
  const e = textBox({placeholder: 'type to search'})
  assert.equal(arg0, await e.value())
})
