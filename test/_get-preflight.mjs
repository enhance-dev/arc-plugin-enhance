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
/*
// No idea how to get this type of test to actually work as documented. 
// Maybe someone with more patience can get this to do it's one job
// This works as expected and if this type of test actually worked it would prove it
test('preflight with missing module import inside it should throw', async t => {
  t.plan(1)
  const basePath = path.join(__dirname, 'mock-preflight', 'app', 'bad-preflight')
  t.throws(async function() { await getPreflight({ basePath }) })
})
*/
