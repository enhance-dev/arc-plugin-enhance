import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router finds right dynamic page mjs', async t => {
  t.plan(1)
  let req = {
    rawPath: '/2020/Jan/day/hour',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  // process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-dynamic-routes', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('HOUR'), 'Got the Right Page')
  console.log(res)
})


test('router finds right dynamic page html', async t => {
  t.plan(1)
  let req = {
    rawPath: '/2020/Feb/week',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  // process.env.ARC_SESSION_TABLE_NAME = 'jwe' // if we do not do this we need to setup dynamo!
  let basePath = path.join(__dirname, 'mock-dynamic-routes', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('WEEK'), 'Got the Right HTML Page')
  console.log(res)
})
