import test from 'tape'
import sorter from '../src/http/any-catchall/_sort-routes.mjs'

test('sorter', t => {
  t.plan(1)
  const good = [
    'views/pages/index.html', // index always wins
    'views/pages/books.mjs',  // explicit named always wins next (alphabetized)
    'views/pages/books/ack.mjs',
    'views/pages/books/new.mjs',
    'views/pages/books/$id/arg.mjs', // less abiguity (has $ but longer)
    'views/pages/books/$id.mjs' // total ambiguity last
  ]
  const bad = [
    'views/pages/books.mjs',
    'views/pages/books/$id.mjs',
    'views/pages/books/$id/arg.mjs',
    'views/pages/books/ack.mjs',
    'views/pages/books/new.mjs',
    'views/pages/index.html'
  ]
  let result = bad.sort(sorter)
  t.ok(JSON.stringify(good) == JSON.stringify(result), 'sorted')
})
