import { readFileSync as read } from 'fs'
import { pathToFileURL } from 'url'

import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import getModule from './_get-module.mjs'
import getElements from './_get-elements.mjs'
import getPageName from './_get-page-name.mjs'
import isJSON from './_is-json-request.mjs'
import backfill from './_backfill-params.mjs'
import render from './_render.mjs'
import fingerprintPaths from './_fingerprint-paths.mjs'
import compareRoute from './_sort-routes.mjs'
import path from 'path'
import { brotliDecompressSync, gunzipSync } from 'zlib'

export default async function api (options, req) {
  let { basePath, altPath } = options

  let apiPath = getModule(basePath, 'api', req.rawPath)
  let pagePath = getModule(basePath, 'pages', req.rawPath)
  let apiBaseUsed = basePath
  let pageBaseUsed = basePath

  if (altPath) {
    let apiPathPart = apiPath && apiPath.replace(path.join(basePath, 'api'), '')
    let pagePathPart = pagePath && pagePath.replace(path.join(basePath, 'pages'), '')

    let altApiPath = getModule(altPath, 'api', req.rawPath)
    let altPagePath = getModule(altPath, 'pages', req.rawPath)
    let altApiPathPart = altApiPath && altApiPath.replace(path.join(altPath, 'api'), '')
    let altPagePathPart = altPagePath && altPagePath.replace(path.join(altPath, 'pages'), '')
    if (!apiPath && altApiPath) {
      apiPath = altApiPath
      apiBaseUsed = altPath
    }
    else if (apiPath && altApiPath && (compareRoute(apiPathPart, altApiPathPart) === 1)) {
      apiPath = altApiPath
      apiBaseUsed = altPath
    }
    if (!pagePath && altPagePath) {
      pagePath = altPagePath
      pageBaseUsed = altPath
    }
    else if (pagePath && altPagePath && (compareRoute(pagePathPart, altPagePathPart) === 1)) {
      pagePath = altPagePath
      pageBaseUsed = altPath
    }
  }

  // if both are defined but match with different specificity
  // (i.e. one is exact and one is a catchall)
  // only the most specific route will match
  if (apiPath && pagePath) {
    let apiPathPart = apiPath.replace(path.join(apiBaseUsed, 'api'), '')
    let pagePathPart = pagePath.replace(path.join(pageBaseUsed, 'pages'), '')
    if (compareRoute(apiPathPart, pagePathPart) === 1) apiPath = false
    if (compareRoute(apiPathPart, pagePathPart) === -1) pagePath = false
  }

  let state = {}
  let isAsyncMiddleware = false

  // rendering a json response or passing state to an html response
  if (apiPath) {

    // only import if the module exists and only run if export equals httpMethod
    let mod
    try {
      mod = await import(pathToFileURL(apiPath).href)
    }
    catch (error) {
      throw new Error(`Issue when trying to import API: ${apiPath}`, { cause: error })
    }

    let method = mod[req.method.toLowerCase()]
    isAsyncMiddleware = Array.isArray(method)
    if (isAsyncMiddleware)
      method = arc.http.async.apply(null, method)
    if (method) {

      // check to see if we need to modify the req and add in params
      req.params = backfill(apiBaseUsed, apiPath, '', req)

      // grab the state from the app/api route
      let res = render.bind({}, apiBaseUsed)
      state = await method(req, res)

      // if the api route does nothing backfill empty json response
      if (!state) state = { json: {} }

      // if the user-agent requested json return the response immediately
      if (isJSON(req.headers)) {
        delete state.location
        return state
      }

      // just return the api response if
      // - not a GET
      // - no corresponding page
      // - location has been explicitly passed
      let location = state.location || (state?.headers?.['location'] || state?.headers?.['Location'])
      if (req.method.toLowerCase() != 'get' || !pagePath || location) {
        return state
      }

      // architect/functions always returns raw lambda response eg. {statusCode, body, headers}
      // but we depend on terse shorthand eg. {json}
      if (isAsyncMiddleware) {
        let b
        if (state.isBase64Encoded) {
          let encoding = state?.headers?.['content-encoding'] || state?.headers?.['Content-Encoding']
          let body = Buffer.from(state.body, 'base64')
          if (encoding === 'br') b = brotliDecompressSync(body).toString()
          if (encoding === 'gzip') b = gunzipSync(body).toString()
        }
        else b = state.body
        state.json = JSON.parse(b) || {}
      }
    }
  }

  // rendering an html page
  let baseHeadElements = await getElements(basePath)
  let altHeadElements = {}
  if (altPath) altHeadElements = await getElements(altPath)
  let head = baseHeadElements.head || altHeadElements.head
  let elements = { ...altHeadElements.elements, ...baseHeadElements.elements }

  const store = state.json
    ? state.json
    : {}

  function html (str, ...values) {
    const _html = enhance({
      elements,
      scriptTransforms: [
        importTransform({ lookup: arc.static })
      ],
      styleTransforms: [
        styleTransform
      ],
      initialState: store
    })
    return fingerprintPaths(_html(str, ...values))
  }

  try {

    // 404
    if (!pagePath || state.code === 404 || state.status === 404 || state.statusCode === 404) {
      let status = 404
      let error = `${req.rawPath} not found`
      let fourOhFour = getModule(basePath, 'pages', '/404')
      if (altPath && !fourOhFour) fourOhFour = getModule(altPath, 'pages', '/404')
      let body = ''
      if (fourOhFour && fourOhFour.includes('.html')) {
        let raw = read(fourOhFour).toString()
        body = html`${head({ req, status, error, store })}${raw}`
      }
      else {
        body = html`${head({ req, status, error, store })}<page-404 error="${error}"></page-404>`
      }
      return { status, html: body }
    }

    // 200
    let status = state.status || state.code || state.statusCode || 200
    let res = {}
    let error = false
    if (pagePath.includes('.html')) {
      let raw = read(pagePath).toString()
      res.html = html`${head({ req, status, error, store })}${raw}`
    }
    else {
      let tag = getPageName(pageBaseUsed, pagePath)
      res.html = html`${head({ req, status, error, store })}<page-${tag}></page-${tag}>`
    }
    res.statusCode = status
    if (state.session) res.session = state.session
    if (isAsyncMiddleware) {
      /* eslint-disable-next-line  no-unused-vars */
      const { 'content-type': contentType, 'content-encoding': contentEncoding, ...otherHeaders } = state.headers
      res.headers = otherHeaders
    }
    return res
  }
  catch (err) {
    // 500
    let status = 500
    let error = err.stack
    console.error(err)
    let fiveHundred = getModule(basePath, 'pages', '/500')
    if (altPath && !fiveHundred) fiveHundred = getModule(altPath, 'pages', '/500')
    let body = ''
    if (fiveHundred && fiveHundred.includes('.html')) {
      let raw = read(fiveHundred).toString()
      body = html`${head({ req, status, error, store })}${raw}`
    }
    else {
      body = html`${head({ req, status, error, store })}<page-500 error="${error}"></page-500>`
    }
    return { status, html: body }
  }
}
