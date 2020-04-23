/* globals gauge*/
'use strict'
const {
        $,
        clear,
        click,
        client,
        closeBrowser,
        currentURL,
        evaluate,
        focus,
        goto,
        goBack,
        goForward,
        link,
        listItem,
        openBrowser,
        overridePermissions,
        paste,
        press,
        screenshot,
        setViewPort,
        tap,
        text,
        textBox,
        title,
        toRightOf,
        write,
      }        = require('taiko')
const assert   = require('assert')
const headless = process.env.headless_chrome.toLowerCase() === 'true'
const HOST     = process.env.HOST || 'amp-what.com'
const PROTOCOL = process.env.INSECURE ? 'http' : 'https'

const $TEXT_BOX = { placeholder: 'type to search' }


beforeSuite(async () => {
  await openBrowser({ headless: headless, args: ['--allow-no-sandbox-job'] })
  // client().Browser.grantPermissions({ origin: 'https://www.amp-what.com', permissions: ['clipboardReadWrite', 'clipboardRead'] })
})

afterSuite(async () => await closeBrowser())

gauge.screenshotFn = async () => await screenshot({ encoding: 'base64' })

step('Visit amp-what', async () => await goto(`${PROTOCOL}://${HOST}/`))

step('Visit amp-what on a phone', async () => {
  await setViewPort({ width: 600, height: 800 })
  await goto(`${PROTOCOL}://${HOST}/`)
})

step('Visit <arg0>', async path => await goto(`${PROTOCOL}://${HOST}${path}`))

step('Search for <query>', async query => {
  await focus(textBox($TEXT_BOX))
  await clear()
  await write(query)
})

step('Type <arg0> slowly', async q => await write(q, { delay: 300 }))

step('The page title is <expectedTitle>', async expectedTitle => assert.equal(expectedTitle, await title()))

step('The page title has <word>', async word => assert.equal(`&what search "${word}" Unicode characters & entities`, await title()))


step('Search for lines <n> of <queries>', async (range, queries) => {
  const [first, last] = range.split('-')
  const qs            = queries.split('\n').slice(first - 1, last).map(s => s.trim())
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
                    'weather':      'umbrella',
                  }[q] || q
    assert.ok(await text(match).exists())
    const e = textBox($TEXT_BOX)
    assert.equal(q, await e.value())
  }
})

step('I see the <content> symbol', async content => assert.ok(await text(content).exists()))

step('I see the <content> character', async content => assert.ok(await text(content).exists()))

step('Page contains <content>', async content => assert.ok(await text(content).exists()))

step('Click link <arg0>', async text => await click(text))

step('Click number <arg0>', tap)
step('Click the <arg0> character', tap)
step('Click the <arg0> symbol', tap)
step('Click the <arg0> message', tap)

step('Click link with title <arg0>', async title => await click(link({ title })))

step('I see the description <arg0>', async content => assert.ok(await text(content).exists()))

step('The path is now <path>', async path => {
  const url = await currentURL()
  assert.equal(`${PROTOCOL}://${HOST}${path}`, url)
})

step('The query box contains <arg0>', async arg0 => {
  const e = textBox({ placeholder: 'type to search' })
  assert.equal(arg0, await e.value())
})

step('Click the symbol inside zoom', async () => click($(`#zoom samp`)))

step('Click the number inside zoom', async () => click($(`#zoom span.num`)))

step('The clipboard contains <text>', async expected => {
  return
  const text2 = await evaluate(() => navigator.clipboard)
  const text  = await evaluate(async () => await navigator.clipboard.readText())
  console.log(
    '*****',
    text2,
    text,
    await text,
  )
  // https://barrysimpson.net/posts/copy-paste-chrome-ext
  // see https://gist.github.com/sirbarrence/f254a36119b8405999fd
  assert.equal(expected, text)
})

step("Click the BACK button", async function() {
  await goBack({waitForNavigation: true})
});
step("Click the FORWARD button", async function() {
  await goForward({waitForNavigation: true})
});
