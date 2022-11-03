import test from 'tape'
import url from 'url'
import path from 'path'
import sandbox from '@architect/sandbox'
import {get} from 'tiny-json-http'

const baseUrl = 'http://localhost:3333'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd:path.join(__dirname,'..') })
  t.pass('local server started')
  t.end()
})

test('Root responds', async t => {
  const response = await get({ url: baseUrl })
  t.ok(response.body, 'We got a response')
  t.end()
})

test('specific API does not get swallowed by catchall page', async t => {
  const response = await get({ url: baseUrl+'/test/one' })
  t.ok(response.body.data==='one', 'API makes it through')
  t.end()
})

test('specific page does not get served by a more generic api handler', async t => {
  const response = await get({ url: baseUrl+'/test/two' })
  const expectedPartial = `<page-test-two></page-test-two>`
  console.log(expectedPartial)
  console.log(response.body)
  t.ok(response.body.includes(expectedPartial), 'only the specific page handler responds')
  t.end()
})

test('Shut down local server', async t => {
  await sandbox.end()
  t.pass('Shut down Sandbox')
  t.end()
})==='one'