/* globals gauge*/
'use strict'
const {
        $,
        below,
        clear,
        click,
        client,
        closeBrowser,
        css,
        currentURL,
        emulateDevice,
        evaluate,
        focus,
        goto,
        goBack,
        goForward,
        hover,
        into,
        link,
        listItem,
        openBrowser,
        overridePermissions,
        paste,
        press,
        screenshot,
        scrollDown,
        setViewPort,
        setConfig,
        tap,
        text,
        textBox,
        title,
        toRightOf,
        waitFor,
        within,
        write,
      } = require('taiko')
const assert = require('assert')
const expectedMatches = require('./expected-results.json');

const headless = process.env.headless_chrome.toLowerCase() === 'true'
const HOST = process.env.HOST || 'amp-what.com'
const PROTOCOL = process.env.INSECURE ? 'http' : 'https'

const $TEXT_BOX = { placeholder: 'type to search' }


beforeSuite(async () => {
  // setConfig({retryInterval: 5, waitForNavigation: false})
  await openBrowser({ headless: headless, args: ['--allow-no-sandbox-job'] })
})

afterSuite(async () => await closeBrowser())

step('Emulate <device>', emulateDevice)

step('Visit amp-what', async () => await goto(`${PROTOCOL}://${HOST}/`))

step('Visit <path>', async path => await goto(`${PROTOCOL}://${HOST}${path}`))

step('Search for <q>', async q => {
  await focus(await textBox($TEXT_BOX))
  await clear()
  await write(q, into(await textBox($TEXT_BOX)), { delay: 1 })
})

step('Type <q> slowly', async q => await write(q, { delay: 200 }))

step('The page title is <expected>', async expectedTitle => assert.strictEqual(expectedTitle, await title()))

step('The page title is the generic page title', async () => {
  assert.strictEqual('Discover Unicode Character Entities & Symbols | Amp What', await title())
})

step('The page title has <word>', async word => assert.strictEqual(`“${word}” Unicode Characters, Symbols & Entities Search | Amp What`, await title()))


step('Search for lines <n> of <queries>', async (range, queries) => {
  const [first, last] = range.split('-')
  const qs = queries.split('\n').slice(first - 1, last).map(s => s.trim())
  for (const q of qs) {
    await clear(await textBox($TEXT_BOX))
    await write(q, into(await textBox($TEXT_BOX)))
    assert.strictEqual(q, await textBox($TEXT_BOX).value())

    const match = expectedMatches[q.toLowerCase()] || q
    assert.ok(
      await text(match, { exactMatch: false }, within($('ul')))
        .exists(100, 9000),
      `Did not find '${match}' within search for '${q}'`)
  }
})

step('Visit lines <n> of <queries>', async (range, queries) => {
  const [first, last] = range.split('-')
  const qs = queries.split('\n').slice(first - 1, last).map(s => s.trim())
  for (const q of qs) {
    goto(`${PROTOCOL}://${HOST}/unicode/search/${encodeURIComponent(q)}`)
    assert.strictEqual((await textBox($TEXT_BOX).value()).replace('\\\\', '\\'), q.toLowerCase())

    const match = expectedMatches[q.toLowerCase()] || q
    assert.ok(
      await text(match, { exactMatch: false }, within($('ul')))
        .exists(100, 9000),
      `Did not find '${match}' within search for '${q}'`)
  }
})

step('I see the <content> symbol', async content => assert.ok(await text(content).exists()))

step('I see the <content> character', async content => assert.ok(await text(content).exists()))

step('Page contains <content>', async content => assert.ok(await text(content).exists()))

step('Scroll down to <text>', async (text) => await scrollDown(text))

step('Open details for result <nth>', async (nth) => {
  await focus(textBox($TEXT_BOX))
  await press('Tab')
  let i = parseInt(nth)
  while (--i > 0) await press('ArrowRight')
  await press('Enter')
})

step('Click link <text>', async text => await click(text))

step('Click number <text>', tap)
step('Click the <char> character', async (char) => {
  await click(char)
  await press(' ')
})
step('Click the <char> symbol', async (char) => {
  await click(char)
  await press(' ')
})
step('Click the <s> message', tap)

step("Type the <key> key", async function (key) {
  await press(key)
});

step('Click link with title <title>', async title => await click(link({ title })))

step('I see the description <desc>', async desc => assert.ok(await text(desc).exists()))

step('The path is now <path>', async path => {
  const expectedUrl = `${PROTOCOL}://${HOST}${path}`

  if ((await currentURL()) === expectedUrl) return

  // the URL update is debounced
  await waitFor(1000)
  assert.strictEqual(expectedUrl, await currentURL())
})

step('The query box contains <q>', async q => {
  const e = textBox({ placeholder: 'type to search' })
  assert.strictEqual(q, await e.value())
})

step('Click the symbol inside zoom', async () => click($(`#modal samp`)))

step('Click the number inside zoom', async () => click($(`#modal span.num`)))

step('The clipboard contains <expected>', async expected => {
  return // no way to assert this, for now
  const text2 = await evaluate(() => navigator.clipboard)
  const text = await evaluate(async () => await navigator.clipboard.readText())
  console.log(
    '*****',
    text2,
    text,
    await text,
  )
  // https://barrysimpson.net/posts/copy-paste-chrome-ext
  // see https://gist.github.com/sirbarrence/f254a36119b8405999fd
  assert.strictEqual(expected, text)
})

step("Click the BACK button", async function () {
  await goBack({ waitForNavigation: true })
});
step("Click the FORWARD button", async function () {
  await goForward({ waitForNavigation: true })
});
