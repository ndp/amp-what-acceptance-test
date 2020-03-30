/* globals gauge*/
"use strict"
const {
        $,
        clear,
        click,
        closeBrowser,
        currentURL,
        evaluate,
        focus,
        goto,
        openBrowser,
        overridePermissions,
        paste,
        press,
        screenshot,
        setViewPort,
        text,
        textBox,
        title,
        toRightOf,
        write,
        getConfig,
        setConfig,
      }        = require('taiko')
const assert   = require("assert")
const headless = process.env.headless_chrome.toLowerCase() === 'true'

const $TEXT_BOX = { placeholder: 'type to search' }


beforeSuite(async () => {
  await openBrowser({ headless: headless })
})

afterSuite(async () => {
  await closeBrowser()
})

gauge.screenshotFn = async function () {
  return await screenshot({ encoding: 'base64' })
}

step("Visit amp-what", async function () {
  await goto('https://amp-what.com/')
})

step("Visit amp-what on a phone", async function () {
  await setViewPort({ width: 600, height: 800 })
  await goto('https://amp-what.com/')
})


step("Visit <arg0>", async function (path) {
  await goto(`https://amp-what.com${path}`)
})

step("Search for <query>", async (query) => {
  await clear()
  await write(query)
})

step("Type <arg0> slowly", async function (q) {
  await write(q, { delay: 300 })
})

step('The page title is <expectedTitle>', async expectedTitle => {
  assert.equal(expectedTitle, await title())
})

step('The page title has <word>', async word => {
  assert.equal(`&what search "${word}" Unicode characters & entities`, await title())
})


step("Search for lines <n> of <queries>", async (range, queries) => {
  const [first, last] = range.split('-')
  const qs            = queries.split("\n").slice(first - 1, last).map(s => s.trim())
  for (const q of qs) {
    await focus(textBox($TEXT_BOX))
    await clear()
    await write(q, { delay: 1 })
    const match = {
                    '/&\\w/':       '&sol',
                    '/note|music/': 'musical symbol coda',
                    'checkbox':     'check',
                    'emoticon':     'kissing face',
                    'home':         'house garden',
                    'search':       'magnifying glass',
                  }[q] || q
    q === 'checkbox' ? 'check' : q
    assert.ok(await text(match).exists())
    const e = textBox($TEXT_BOX)
    assert.equal(q, await e.value())
  }
})

step("I see the <content> symbol", async function (content) {
  assert.ok(await text(content).exists())
})

step("I see the <content> character", async function (content) {
  assert.ok(await text(content).exists())
})

step("Page contains <content>", async (content) => {
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
  const e = textBox({ placeholder: 'type to search' })
  assert.equal(arg0, await e.value())
})

step('Click the symbol inside zoom', async () => {
  click($(`#zoom samp`))
})

step('Click the number inside zoom', async () => {
  click($(`#zoom span.num`))
})
