import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, '..', 'app')
  let result = await router(base, req)
  t.ok(result, 'got result')
  console.log(result)
})
