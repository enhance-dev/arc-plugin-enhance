import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router dots', async t => {
  t.plan(1)
  process.env.ARC_SESSION_TABLE_NAME = 'jwe'
  let basePath = path.join(__dirname, 'mock-dots', 'app')
  let res = await router.bind({}, { basePath })({
    rawPath: '/.well-known/webfinger',
    method: 'GET',
    headers: {
      'accept': 'application/json',
    }
  })
  t.ok(res.json.hello, 'hiii')
  console.log(res)
})
