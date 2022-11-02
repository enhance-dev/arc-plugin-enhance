import test from 'tape'
import url from 'url'
import path from 'path'
import sandbox from '@architect/sandbox'
import {get} from 'tiny-json-http'


const __dirname = path.dirname(url.fileURLToPath(import.meta.url))


test(`Start local server`, async t => {
  await sandbox.start({ quiet: true, cwd:path.join(__dirname,'..') })

  t.pass('local server started')
  t.end()
})

test('Api should return expected result', async t => {
  const response = await get({ url: 'http://localhost:3333/session-test' })


  t.equal(response.body.session, response.body.sessionExiting, 'session is passed correctly from API')
  t.end()
})

test('Shut down local server', async t => {
  await sandbox.end()

  t.pass('Shut down Sandbox')
  t.end()
})