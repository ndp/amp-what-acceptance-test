# amp-what-acceptance-test
Acceptance Tests for amp-what.com, written in Gauge

## Prerequisites

```
brew install gauge # install gauge, from https://docs.gauge.org/getting_started/installing-gauge.html?os=macos&language=javascript&ide=vscode
gauge install js
```

## Running Tests
```
$ yarn test
```

## DNS Tests

(Manual)

```sh
$ curl http://amp-what.com
Moved Permanently. Redirecting to https://www.amp-what.com/
$ curl https://amp-what.com
Moved Permanently. Redirecting to https://www.amp-what.com/
$ curl ampwhat.com
Moved Permanently. Redirecting to https://www.amp-what.com/
$ curl www.ampwhat.com
Moved Permanently. Redirecting to https://www.amp-what.com/
$ curl amp-what.com/foo
Moved Permanently. Redirecting to https://www.amp-what.com/foo
$ curl http://amp-what.com/foo
Moved Permanently. Redirecting to https://www.amp-what.com/foo
$ curl ampwhat.com/foo
Moved Permanently. Redirecting to https://www.amp-what.com/foo
$ curl www.ampwhat.com/foo
Moved Permanently. Redirecting to https://www.amp-what.com/foo
```

## Timeouts

These in defaultProperties did not work:

```
navigation_timeout=43000
runner_connection_timeout=4400
```
Nor these in jsproperties:
```
navigation_timeout=41000
NAVIGATION_TIMEOUT=40000
```

None of these did it:

```
$ gauge config check_updates true
$ gauge config runner_request_timeout 39000
$ gauge config runner_connection_timeout 38000
$ gauge config ide_request_timeout 37000
```
