import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router middleware passes values', async t => {
  t.plan(2)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }
  process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-async-middleware', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(Array.isArray(JSON.parse(res.body).stuff), 'got the right stuff')
  t.ok(res.headers['set-cookie'], 'got a set-cookie header')
  console.log(res)
})

test('router middleware respects redirects', async t => {
  t.plan(2)
  let req = {
    rawPath: '/test-redirect',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-async-middleware', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.equals(res.headers["Location"], "/login", "req location matches")
  t.equals(res.statusCode, 302, "proper redirect status")
  console.log(res)
})
