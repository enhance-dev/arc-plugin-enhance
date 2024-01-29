import test from 'tape'
import url from 'url'
import path from 'path'
import sandbox from '@architect/sandbox'
import tiny from 'tiny-json-http'

const baseUrl = 'http://localhost:3333'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd: path.join(__dirname, '..') })
  t.pass('local server started')
  t.end()
})

test('GET request', async t => {
  const response = await tiny.get({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs' })
  const expected = `{"verb":"get"}`
  t.ok(JSON.stringify(response.body) === expected, 'GET response')
  t.end()
})

test('HEAD request', async t => {
  const response = await tiny.head({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs' })
  const expected = `application/json; charset=utf8`
  t.ok(response.headers['content-type'] === expected, 'HEAD response')
  t.end()
})

test('OPTIONS request', async t => {
  const response = await tiny.options({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs' })
  const expected = `OPTIONS, GET, HEAD, POST`
  t.ok(response.headers['allow'] === expected, 'OPTIONS response')
  t.end()
})

test('POST request', async t => {
  const response = await tiny.post({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs', data: {} })
  const expected = `{"verb":"post"}`
  t.ok(JSON.stringify(response.body) === expected, 'POST response')
  t.end()
})

test('PUT request', async t => {
  const response = await tiny.put({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs', data: {} })
  const expected = `{"verb":"put"}`
  t.ok(JSON.stringify(response.body) === expected, 'PUT response')
  t.end()
})

test('PATCH request', async t => {
  const response = await tiny.patch({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs', data: {} })
  const expected = `e0023aa4f`
  t.ok(response.headers['etag'] === expected, 'PATCH response')
  t.end()
})

test('DELETE request', async t => {
  const response = await tiny.del({ headers: { 'accept': 'application/json' }, url: baseUrl + '/verbs', data: {} })
  const expected = `{"verb":"delete"}`
  t.ok(JSON.stringify(response.body) === expected, 'DELETE response')
  t.end()
})

test('Shut down local server', async t => {
  await sandbox.end()
  t.pass('Shut down Sandbox')
  t.end()
}) === 'one'
