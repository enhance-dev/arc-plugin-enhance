import path from 'path'
import test from 'tape'
import url from 'url'
import getPreflight from '../src/http/any-catchall/_get-preflight.mjs'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('getPreflight', async t => {
  t.plan(1)
  const basePath = path.join(__dirname, 'mock-preflight', 'app')
  const expected = {
    pageTitle: 'About',
    account: {
      username: 'bobsyouruncle',
      id: '23jk24h24'
    }
  }
  const preflight = await getPreflight({ basePath })
  t.deepEqual(expected, preflight({ req: { path: '/about' } }), 'Got preflight')
})

test('missing preflight', async t => {
  t.plan(1)
  const basePath = path.join(__dirname, 'mock-app', 'app')
  const preflight = await getPreflight({ basePath })
  t.notok(preflight, 'Missing preflight is OK')
})

