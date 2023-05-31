import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router with result in both', async t => {
  t.plan(1)
  let req = {
    rawPath: '/about',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath, altPath })(req)
  t.ok(result.html.includes('fred'), 'got the right page')
})

test('router with result in both reversed', async t => {
  t.plan(1)
  let req = {
    rawPath: '/about',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath: altPath, altPath: basePath })(req)
  t.ok(result.html.includes('backup'), 'got the right page')
})

test('router with result in alternative', async t => {
  t.plan(1)
  let req = {
    rawPath: '/backup-data',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath, altPath })(req)
  t.ok(result.json.data.includes('fred'), 'got the right page')
})

test('router with result in both reversed', async t => {
  t.plan(1)
  let req = {
    rawPath: '/about',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath: altPath, altPath: basePath })(req)
  console.log(result)
  t.ok(result.html.includes('backup'), 'got the right page')
})

test('router with result in alternative', async t => {
  t.plan(1)
  let req = {
    rawPath: '/backup-data',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router({ basePath, altPath }, req)
  t.deepEqual(result.json.data, [ 'fred', 'joe', 'mary' ], 'got result')
})

test('router with no pages dir', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let primaryApp = path.join(__dirname, '..', 'app')
  let secondaryApp = path.join(__dirname, 'mock-folders', 'app')
  let result = await router({ basePath: primaryApp, altPath: secondaryApp }, req)
  t.ok(result, 'got result')
})

test('router with result in both reversed', async t => {
  t.plan(1)
  let req = {
    rawPath: '/about',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath: altPath, altPath: basePath })(req)
  console.log(result)
  t.ok(result.html.includes('backup'), 'got the right page')
})

test('router with result in alternative', async t => {
  t.plan(1)
  let req = {
    rawPath: '/backup-data',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router({ basePath, altPath }, req)
  t.deepEqual(result.json.data, [ 'fred', 'joe', 'mary' ], 'got result')
})

test('router with no pages dir', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let primaryApp = path.join(__dirname, '..', 'app')
  let secondaryApp = path.join(__dirname, 'mock-folders', 'app')
  let result = await router({ basePath: primaryApp, altPath: secondaryApp }, req)
  t.ok(result, 'got result')
})

test('Matches in both with higher weight in alternate path', async t => {
  t.plan(1)
  let req = {
    rawPath: '/one/two/three-alt',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let basePath = path.join(__dirname, '..', 'app')
  let altPath = path.join(__dirname, 'mock-apps', 'app')
  let result = await router.bind({}, { basePath: altPath, altPath: basePath })(req)
  console.log(result)
  t.ok(result?.json?.where?.includes('three-alt'), 'got the right page')
})
