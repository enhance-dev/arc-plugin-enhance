import test from 'tape'
import sorter from '../src/http/any-catchall/_sort-routes.mjs'

test('sorter', t => {
  t.plan(1)
  const good = [
    'index.mjs',
    'views/index.mjs',
    'views/pages/books/index.mjs',
    'views/pages/books/new.mjs',
    'views/pages/books/ack.mjs',
    'views/pages/books/back.mjs',
    'views/pages/books/$id/arg.mjs', 
    'views/pages/books/$id.mjs', 
    'views/pages/books/$$.mjs',
    'views/pages/$thing/food/arg.mjs', 
    'views/pages/$thing/id/$place.mjs', 
    'views/pages/$thing/$id/$place.mjs', 
    'views/pages/$$.mjs',
    'views/$$.mjs',
    '$$.mjs',
  ]
  const bad = [
    '$$.mjs',
    'views/$$.mjs',
    'views/pages/$$.mjs',
    'views/pages/$thing/$id/$place.mjs', 
    'views/pages/$thing/id/$place.mjs', 
    'views/pages/$thing/food/arg.mjs', 
    'views/pages/books/$$.mjs',
    'views/pages/books/$id.mjs', 
    'views/pages/books/$id/arg.mjs', 
    'views/pages/books/new.mjs',
    'views/pages/books/ack.mjs',
    'views/pages/books/back.mjs',
    'views/pages/books/index.mjs',
    'views/index.mjs',
    'index.mjs',
  ]

  let result = bad.sort(sorter)

  t.deepEqual(result,good, 'sorted')
})

test('sort dynamic parts diff positions ', t => {
  t.plan(1)
  const good = [
    'views/cats/food/$id.mjs', 
    'views/$thing/food/arg.mjs', 
  ]
  const bad = [
    'views/$thing/food/arg.mjs', 
    'views/cats/food/$id.mjs', 
  ]

  let result = bad.sort(sorter)

  t.deepEqual(result,good, 'sorted')
})