import path from 'node:path'
import url from 'node:url'
import test from 'tape'
import getUserFile from '../../src/http/any-catchall/_get-user-file.mjs'

const here = path.dirname(url.fileURLToPath(import.meta.url))

test('getPreflight', async t => {
  t.plan(1)
  const basePath = path.join(here, '..', 'mocks', 'mock-preflight', 'app')
  const expected = {
    pageTitle: 'About',
    account: {
      username: 'bobsyouruncle',
      id: '23jk24h24'
    }
  }
  const preflight = await getUserFile({ basePath, fileName: 'preflight.mjs' })
  t.deepEqual(expected, preflight({ req: { path: '/about' } }), 'Got preflight')
})

test('missing preflight', async t => {
  t.plan(1)
  const basePath = path.join(here, '..', 'mocks', 'mock-app', 'app')
  const preflight = await getUserFile({ basePath, fileName: 'preflight.mjs' })
  t.notok(preflight, 'Missing preflight is OK')
})

test('preflight with missing module import inside it should throw', async t => {
  t.plan(1)
  const basePath = path.join(here, '..', 'mocks', 'mock-preflight', 'app', 'bad-preflight')
  try {
    await getUserFile({ basePath, fileName: 'preflight.mjs' })
    t.fail('Missing module import should throw')
  }
  catch (error) {
    t.ok(error, 'Missing module import throws')
  }
})
