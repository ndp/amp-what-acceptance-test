# amp-what-acceptance-test
Acceptance Tests for amp-what.com, written in Playwright

## Running Tests
```
$ yarn test
$ yarn test:staging
$ yarn test:localhost
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
