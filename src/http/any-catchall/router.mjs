import { readFileSync as read } from 'fs'

import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import getModule from './_get-module.mjs'
import getElements from './_get-elements.mjs'
import getPageName from './_get-page-name.mjs'
import isJSON from './_is-json-request.mjs'
import backfill from './_backfill-params.mjs'

export default async function api (basePath, req) {

  let apiPath = getModule(basePath, 'api', req.rawPath)
  let pagePath = getModule(basePath, 'pages', req.rawPath)
  let state = {}
 
  // rendering a json response or passing state to an html response
  if (apiPath) {

    // only import if the module exists and only run if export equals httpMethod
    let mod = await import(apiPath)
    let method = mod[req.method.toLowerCase()]
    if (method) {
 
      // check to see if we need to modify the req and add in params
      req.params = backfill(basePath, apiPath, pagePath, req)
 
      // grab the state from the app/api route
      state = await method(req)
 
      // if the api route does nothing backfill empty json response
      if (!state) state = { json:{} }
 
      // if the user-agent requested json return the response immediately
      if (isJSON(req.headers)) {
        delete state.location
        return state
      }
 
      // if not a GET just return api response; or if no corresponding page
      if (req.method.toLowerCase() != 'get' || !pagePath) {
        return state
      }
    }
  }

  // rendering an html page
  let { head, elements } = await getElements(basePath)

  const html = enhance({
    elements,
    scriptTransforms: [
      importTransform({ map: arc.static })
    ],
    styleTranstforms: [
      styleTransform
    ],
    initialState: state.json? state.json : {}
  })

  try {

    // 404
    if (!pagePath) {
      const body = html`
        ${ head({ title: '404' }) }
        <page-404 error="${req.rawPath} not found"></page-404>
      `
      return { status: 404, html: body }
    }

    // 200
    let res = {}
    if (pagePath.includes('.html')) {
      let raw = read(pagePath).toString()
      res.html = html`${ head({ title:'' }) }${ raw }`
    }
    else {
      let tag = getPageName(basePath, pagePath)
      res.html = html`${ head({ title:'' }) }<page-${ tag }></page-${ tag }>`
    }
    res.statusCode = state.status || state.code || state.statusCode || 200
    if (state.session) res.session = state.session
    if (state.location) res.location = state.location
    return res
  }
  catch (err) {
    // 500
    const body = html`
      ${ head({ title: '500' }) }
      <page-500 error="${ err.message }"></page-500>
    `
    return { status: 500, html: body }
  }
}
