import path from 'path'
import test from 'tape'
import getFiles from '../src/http/any-catchall/_get-files.mjs'

test('getFiles', async t => {
  t.plan(1)
  let base = path.join(process.cwd(), 'app')
  let folder = 'pages'
  let expected = path.join(base, folder)
  let result = await getFiles(base, folder)
  let results = result.map(f => f.startsWith(expected))
  let truthy = results.filter(Boolean)
  t.ok(truthy.length === results.length, 'got filtered list')
})

