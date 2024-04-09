import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router page with html element', async t => {
  t.plan(1)
  let req = {
    rawPath: '/test-element',
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
  }
  let basePath = path.join(__dirname, 'mock-html-elements', 'app')
  let res = await router.bind({}, { basePath })(req)
  t.ok(res.html.includes('This is a HTML only element.'), 'rendered html only elements')
})
