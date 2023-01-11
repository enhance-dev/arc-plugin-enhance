import test from 'tape'
import url from 'url'
import path from 'path'
import backfill from '../src/http/any-catchall/_backfill-params.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('backfill - null case', async (t) => {
  t.plan(1)
  let basePath = path.join(__dirname, '..', 'app')
  let apiPath = path.join(basePath, '/api/foo')
  let pagePath = undefined
  let req = {
    rawPath: '/foo',
    params: {},
  }

  let params = backfill(basePath, apiPath, pagePath, req)
  t.deepEqual(params, req.params, 'No params in null case')
})

test("backfill - one level '/api/foo/$id'", async (t) => {
  t.plan(1)
  let basePath = path.join(__dirname, '..', 'app')
  let apiPath = path.join(basePath, '/api/foo/$id')
  let pagePath = undefined
  let req = {
    rawPath: '/foo/5',
    params: {},
  }

  let params = backfill(basePath, apiPath, pagePath, req)
  t.deepEqual(params, { id: '5' }, '$id param parsed correctly')
})

test("backfill - pathological '/api/foo/$first/bar/$second/baz/$third'", async (t) => {
  t.plan(1)
  let basePath = path.join(__dirname, '..', 'app')
  let apiPath = path.join(basePath, '/api/foo/$first/bar/$second/baz/$third')
  let pagePath = undefined
  let req = {
    rawPath: '/foo/5/bar/6/baz/7',
    params: {},
  }

  let params = backfill(basePath, apiPath, pagePath, req)
  t.deepEqual(
    params,
    { first: '5', second: '6', third: '7' },
    'all params parsed correctly'
  )
})
