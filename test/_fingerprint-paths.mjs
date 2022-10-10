import test from 'tape'
import { replaceEvery } from '../src/http/any-catchall/_fingerprint-paths.mjs'


test('path fingerpinter', t => {
  t.plan(1)
  const input = `
  /_public/foo.mjs
  /_public/foo/foo.mjs
  /_public/fooooo.mjs
  /_public/bar.mjs
  `
  const manifest = {
    'foo.mjs':'foo-abc.mjs',
    'bar.mjs':'bar-1$1.mjs',
    'foo/foo.mjs':'foo/foo-123.mjs'
  }
  const expected = `
  /_public/foo-abc.mjs
  /_public/foo/foo-123.mjs
  /_public/fooooo.mjs
  /_public/bar-1$1.mjs
  `
  let result = replaceEvery(input,manifest)
  console.log(result)

  t.equal(result,expected, 'fingerprinted')
})