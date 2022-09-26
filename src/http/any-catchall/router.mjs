import { readFileSync as read } from 'fs'
import { pathToFileURL } from 'url';

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

export default async function api (basePath, req) {

  let apiPath = getModule(basePath, 'api', req.rawPath)
  let pagePath = getModule(basePath, 'pages', req.rawPath)

  let state = {}

  // rendering a json response or passing state to an html response
  if (apiPath) {

    // only import if the module exists and only run if export equals httpMethod
    let mod = await import(pathToFileURL(apiPath).href)
    let method = mod[req.method.toLowerCase()]
    if (Array.isArray(method))
      method = arc.http.async.apply(null, method)
    if (method) {

      // check to see if we need to modify the req and add in params
      req.params = backfill(basePath, apiPath, pagePath, req)

      // grab the state from the app/api route
      let res =  render.bind({}, basePath)
      state = await method(req, res)

      // if the api route does nothing backfill empty json response
      if (!state) state = { json:{} }

      // if the user-agent requested json return the response immediately
      if (isJSON(req.headers)) {
        delete state.location
        return state
      }

      // just return the api response if
      // - not a GET
      // - no corresponding page
      // - state.location has been explicitly passed
      if (req.method.toLowerCase() != 'get' || !pagePath || state.location) {
        return state
      }
    }
  }

  // rendering an html page
  let { head, elements } = await getElements(basePath)

  const initialState = state.json
    ? state.json
    : {}
  const html = enhance({
    elements,
    scriptTransforms: [
      importTransform({ lookup: arc.static })
    ],
    styleTransforms: [
      styleTransform
    ],
    initialState
  })

  try {

    // 404
    if (!pagePath || state.code === 404 || state.status === 404 || state.statusCode === 404) {
      const status = 404
      const error = `${req.rawPath} not found`
      const fourOhFour = getModule(basePath, 'pages', '/404')
      let body = ''
      if (fourOhFour && fourOhFour.includes('.html')) {
        let raw = read(fourOhFour).toString()
        body = html`${ head({ req, status, error }) }${ raw }`
      }
      else {
        body = html`${ head({ req, status, error }) }<page-404 error="${error}"></page-404>`
      }
      return { status, html: body }
    }

    // 200
    const status = state.status || state.code || state.statusCode || 200
    let res = {}
    const state = Object.assign(initialState, { req, status })
    if (pagePath.includes('.html')) {
      let raw = read(pagePath).toString()
      res.html = html`${ head(state) }${ raw }`
    }
    else {
      let tag = getPageName(basePath, pagePath)
      res.html = html`${ head(state) }<page-${ tag }></page-${ tag }>`
    }
    res.statusCode = status
    if (state.session) res.session = state.session
    return res
  }
  catch (err) {
    // 500
    const status = 500
    const error = err.message || ''
      const fiveHundred = getModule(basePath, 'pages', '/500')
      let body = ''
      if (fiveHundred && fiveHundred.includes('.html')) {
        let raw = read(fiveHundred).toString()
        body = html`${ head({ req, status, error }) }${ raw }`
      }
      else {
        body = html`${ head({ req, status, error }) }<page-500 error="${ error }"></page-500>`
      }
      return { status, html: body }
  }
}
