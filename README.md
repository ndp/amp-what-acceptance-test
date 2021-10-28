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
