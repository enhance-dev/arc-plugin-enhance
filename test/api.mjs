import url from 'url'
import path from 'path'
import test from 'tape'

import api from '../src/http/any-catchall/api.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('api can get json', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  }
  let base = path.join(__dirname, '..', 'app')
  let result = await api(base, req)
  t.ok(result, 'got result')
  console.log(result)
})

test('api can pass session to a page', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, '..', 'app')
  await api(base, req)
  t.ok('pageSession' in req, 'req.pageSession defined for next middleware')
})
