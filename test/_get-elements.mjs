import path from 'path'
import test from 'tape'
import getElements from '../src/http/any-catchall/_get-elements.mjs'

test('getElements', async t => {
  t.plan(1)
  let base = path.join(process.cwd(), 'app')
  let folder = 'elements'
  let { elements } = await getElements(base, folder)
  t.ok(Object.keys(elements).length > 0, 'got filtered list')
})

