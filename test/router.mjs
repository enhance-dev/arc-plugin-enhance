import test from 'tape'
import url from 'url'
import path from 'path'
import router from '../src/http/any-catchall/router.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

test('router', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, '..', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result, 'got result')
  console.log(result)
})

test('router with no pages folder', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'GET',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, 'mock-folders', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result, 'got result')
})

test('headers pass thru application/json', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'get',
    headers: {
      'accept': 'application/json'
    }
  }
  let base = path.join(__dirname, 'mock-headers', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result.headers['x-custom-header'] === 'custom-header-value', 'x-custom-header: custom-header-value')
})

test('headers pass thru application/json middleware', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'post',
    headers: {
      'accept': 'application/json'
    }
  }
  let base = path.join(__dirname, 'mock-headers', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result.headers['x-custom-header'] === 'custom-header-value', 'x-custom-header: custom-header-value')
})

test('headers pass thru text/html', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'get',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, 'mock-headers', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result.headers['x-custom-header'] === 'custom-header-value', 'x-custom-header: custom-header-value')
  console.log(result)
})

test('headers pass thru text/html middleware', async t => {
  t.plan(1)
  let req = {
    rawPath: '/',
    method: 'post',
    headers: {
      'accept': 'text/html'
    }
  }
  let base = path.join(__dirname, 'mock-headers', 'app')
  let result = await router({ basePath: base }, req)
  t.ok(result.headers['x-custom-header'] === 'custom-header-value', 'x-custom-header: custom-header-value')
})
