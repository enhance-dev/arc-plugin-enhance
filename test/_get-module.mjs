import path from 'path'
import url from 'url'
import test from 'tape'
import getModule from '../src/http/any-catchall/_get-module.mjs'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('getModules', async t => {
  t.plan(1)
  let base = path.join(__dirname,'..', 'app')
  let folder = 'pages'
  let expected = path.join(base, folder, 'index.html')
  let result = await getModule(base, folder, '/')
  t.equal(expected, result, 'Got back index')
})

test('getModules multiple params', async t => {
  t.plan(1)
  let base = path.join(__dirname, 'mocks', 'mock-folders', 'app')
  let folder = 'api/foo/$first/bar/$second/baz'
  let file = '$third.mjs'
  let expected = path.join(base, folder, file)
  let result = await getModule(base, 'api', '/foo/7/bar/8/baz/9')
  t.equal(expected, result, 'Got the api with multiple params')
})

test('getModules catchall', async t => {
  t.plan(1)
  let base = path.join(__dirname,'mocks', 'mock-folders','app')
  let folder = 'api/place/$id'
  let file = '$$.mjs'
  let expected = path.join(base, folder, file)
  let result = await getModule(base, folder, '/place/anything/anywhere')
  t.equal(expected, result, 'Got the catchall')
})

