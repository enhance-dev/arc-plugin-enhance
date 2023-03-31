import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('middleware parsed json state happens', async t => {
  t.plan(2)
  let req = {
    rawPath: '/test-store',
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  }
  process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-async-middleware', 'app')
  let res = await router.bind({}, { basePath })(req)
  let stuff = JSON.parse(res.body).stuff
  t.ok(Array.isArray(stuff), 'stuff')
  t.ok(stuff[0] === 1, 'stuff[0] is 1')
  console.log(stuff)
})

test.only('middleware parsed json state passes thru to html render', async t => {
  t.plan(4)
  let req = {
    rawPath: '/test-store',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-async-middleware', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('<debug-state>'), 'res html includes <debug-state>')
  t.ok(res.headers['set-cookie'], 'set-cookie')
  let r = new RegExp('<pre[^>]*>(.*?)</pre>')
  let s = res.html.replace(/\n/g, '').match(r)[1]
  let j = JSON.parse(s)
  console.log(j)
  t.ok(Array.isArray(j.store.stuff), 'stuff')
  t.ok(j.store.stuff[0] === 1, 'stuff[0] is 1')
})
