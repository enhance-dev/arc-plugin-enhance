import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('test default 404 page', async t => {
  t.plan(2)
  let req = {
    rawPath: '/nope',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, 'mock-folders', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result, 'got result')
  t.equal(result.status, 404, 'Default 404 page')
  console.log(result)
})

test('overridden 404 page', async t => {
  t.plan(2)
  let req = {
    rawPath: '/nope',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, 'mock-errors', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result.html.includes('Custom 404'), 'got result')
  t.equal(result.status, 404, 'Overridden 404 page')
  console.log(result)
})
