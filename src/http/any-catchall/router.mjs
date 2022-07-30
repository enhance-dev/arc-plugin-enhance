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

  // if the route matches api/path/to/thing then we are running this function
  let apiPath = getModule(basePath, 'api', req.rawPath)
  let pagePath = getModule(basePath, 'pages', req.rawPath)
  let state = {}

  if (apiPath) {
    // only import if the module exists and only run if export equals httpMethod
    let mod = await import(apiPath)
    let method = mod[req.method.toLowerCase()]
    if (method) {

      // check to see if we need to modify the req and add in params
      req.params = backfill(basePath, apiPath, pagePath, req)

      // grab the state from the app/api route
      state = await method(req)

      // if the user-agent requested json return it immediately
      if (isJSON(req.headers)) {
        delete state.location
        return state
      }

      // if not a GET just return api response
      if (req.method.toLowerCase() != 'get') {
        return state
      }
    }
  }
  
  // always runs next middleware unless we early return
  let { head, elements } = await getElements(basePath)

  const html = enhance({
    elements,
    scriptTransforms: [
      importTransform({ map: arc.static })
    ],
    styleTranstforms: [
      styleTransform
    ],
    initialState: state.json || {}
  })

  if (!pagePath) {
    const body = html`
      ${ head({ title: '404' }) }
      <page-404 error="${req.rawPath} not found"></page-404>
    `
    return { status: 404, html: body }
  }

  try {
    // rendering html page
    if (pagePath.includes('.html')) {
      let raw = read(pagePath).toString()
      let body = html`${ head({ title:'' }) }${ raw }`
      let res = { html: body }
      if (state.session) 
        res.session = state.session
      return res
    }
    else {
      // rendering custom element page
      let title = getPageName(basePath, pagePath)
      let body = html`${ head({ title:'' }) }<page-${ title }></page-${ title }>`
      let res = { html: body }
      if (state.session)
        res.session = state.session
      return res
    }
  }
  catch (err) {
    const body = html`
      ${ head({ title: '500' }) }
      <page-500 error="${ err.message }"></page-500>
    `
    return { status: 500, html: body }
  }
}
