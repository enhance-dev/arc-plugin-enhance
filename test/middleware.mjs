import test from 'tape'
import url from 'url'
import path from 'path'
import sandbox from '@architect/sandbox'
import { get } from 'tiny-json-http'

const baseUrl = 'http://localhost:3333'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd: path.join(__dirname, '..') })
  t.pass('local server started')
  t.end()
})

test('request to route using middleware responds', async t => {
  const response = await get({ url: baseUrl + '/middleware-test' })
  t.ok(response.body === 'one', 'middleware responds')
  t.end()
})

test('Shut down local server', async t => {
  await sandbox.end()
  t.pass('Shut down Sandbox')
  t.end()
}) === 'one'
