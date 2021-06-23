/* globals gauge*/
'use strict'
const {
        $,
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
        into,
        link,
        listItem,
        openBrowser,
        overridePermissions,
        paste,
        press,
        screenshot,
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
const path = require('path')

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

step('Visit <arg0>', async path => await goto(`${PROTOCOL}://${HOST}${path}`))

step('Search for <query>', async query => {
  await focus(textBox($TEXT_BOX))
  await clear()
  await write(query, { delay: 1 })
})

step('Type <arg0> slowly', async q => await write(q, { delay: 200 }))

step('The page title is <expectedTitle>', async expectedTitle => assert.equal(expectedTitle, await title()))

step('The page title is the generic page title', async () => {
  assert.equal('Amp What: Discover Unicode & HTML Character Entities', await title())
})

step('The page title has <word>', async word => assert.equal(`Amp What search “${word}” Unicode Characters & Entities`, await title()))


step('Search for lines <n> of <queries>', async (range, queries) => {
  const [first, last] = range.split('-')
  const qs = queries.split('\n').slice(first - 1, last).map(s => s.trim())
  for (const q of qs) {
    await clear(textBox($TEXT_BOX))
    await write(q, into(textBox($TEXT_BOX)))
    assert.equal(q, await textBox($TEXT_BOX).value())

    const match = {
      '/&\\w/':         '&sol',
      '/note|music/':   'musical symbol coda',
      '>>':             'raquo',
      'arr':            'squat black rightwards arrow',
      'arrow':          'squat black rightwards arrow',
      'arrow down':     'down-right arrow',
      'box':            'open box',
      'bracket':        'fullwidth left square bracket',
      'checkbox':       'check',
      'check':          'ballot box check',
      'chess':          'chess pawn',
      'circle':         'double circled digit eight',
      'cross':          'latin cross',
      'currency':       'banknote euro sign',
      'dash':           'swung dash',
      'degree':         'degree sign',
      'diamond':        'ring',
      'dot':            'middle dot',
      'down':           'down arrowhead',
      'down arro':      'downwards arrow',
      'emoticon':       'kissing face',
      'emoji':          'kissing face',
      'esperanto':      'latin small letter j circumflex',
      'french':         'Ë',
      'heart':          'two hearts',
      'home':           'house garden',
      'icon':           'fax icon',
      'latin ligature': 'latin small ligature fi',
      'left':           'left parenthesis',
      'line':           'vertical line',
      'money':          'money bag',
      'music':          'sharp',
      'peace':          'peace symbol',
      'phone':          'mobile phone',
      'plus':           'plus sign',
      'quote':          'apostrophe',
      'right':          'right parenthesis',
      'search':         'right-pointing magnifying glass',
      'square':         'square root',
      'star':           'asterisk',
      'tibet':          'tibetan syllable om',
      'tick':           'apostrophe',
      'triangle':       'upwards triangle arrowhead',
      'up':             'upwards arrow',
      'weather':        'umbrella',
    }[q.toLowerCase()] || q
    assert.ok(
      await text(match, { exactMatch: false }, within($('ul')))
        .exists(100, 9000),
      `Did not find '${match}' within search for '${q}'` )
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
  const expectedUrl = `${PROTOCOL}://${HOST}${path}`

  if ((await currentURL()) === expectedUrl) return

  // the URL update is debounced
  await waitFor(1000)
  assert.equal(expectedUrl, await currentURL())
})

step('The query box contains <arg0>', async arg0 => {
  const e = textBox({ placeholder: 'type to search' })
  assert.equal(arg0, await e.value())
})

step('Click the symbol inside zoom', async () => click($(`#modal samp`)))

step('Click the number inside zoom', async () => click($(`#modal span.num`)))

step('The clipboard contains <text>', async expected => {
  return
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
  assert.equal(expected, text)
})

step("Click the BACK button", async function () {
  await goBack({ waitForNavigation: true })
});
step("Click the FORWARD button", async function () {
  await goForward({ waitForNavigation: true })
});
