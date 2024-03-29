import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router finds right dynamic page mjs', async t => {
  t.plan(1)
  let req = {
    rawPath: '/one/two/three',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  let basePath = path.join(__dirname, 'mock-dynamic-routes', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('LEVEL3'), 'Got the Right mjs Page')
  console.log(res)
})


test('router finds right dynamic html page', async t => {
  t.plan(1)
  let req = {
    rawPath: '/one/two',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  let basePath = path.join(__dirname, 'mock-dynamic-routes', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('LEVEL2'), 'Got the Right HTML Page')
  console.log(res)
})


test('router finds right dynamic catch-all html page', async t => {
  t.plan(1)
  let req = {
    rawPath: '/docs/anything',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  let basePath = path.join(__dirname, 'mock-dynamic-routes', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('DOCS'), 'Got the Right HTML Page')
  console.log(res)
})
