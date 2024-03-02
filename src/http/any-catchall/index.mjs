import path from 'node:path'
import process from 'node:process'
import url from 'node:url'

import arc from '@architect/functions'
import loader from '@enhance/loader'
import core from '@enhance/core'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import fingerprintPublicRefs from './_fingerprint-paths.mjs'
import getUserFile from './_get-user-file.mjs'
import _404 from './templates/404.mjs'
import _500 from './templates/500.mjs'
import _head from './templates/head.mjs'

const { ENHANCE_DEBUG = 0 } = process.env
const DEBUG = Number(ENHANCE_DEBUG) || 0

const here = path.dirname(url.fileURLToPath(import.meta.url)) // SOMEDAY: import.meta.dirname
const basePath = path.join(here, 'node_modules', '@architect', 'views')

// * Stages:
//   cold:
//     find head, preflight, postflight
//     load "Core" config from disk
//     create "Core"
//   pre-route: execute preflight
//   "Core" routeAndRender
//   post-route: fingerprint paths + merge headers

// top-level cache for warm execution
let config = await loader({ basePath, debug: DEBUG > 1 })
const userHead = await getUserFile(basePath, 'head.mjs')
const userPreflight = await getUserFile(basePath, 'preflight.mjs')

export async function createRouter (base) {
  if (base) config = await loader({ basePath: base })

  return core({
    ...config,
    ssrOptions: {
      scriptTransforms: [ importTransform({ lookup: arc.static }) ],
      styleTransforms: [ styleTransform ],
    },
    // state: {},
    head: userHead || _head,
    debug: DEBUG > 0,
  })
}

let app
async function http (req, ctx) {
  let state = {}
  if (userPreflight) state = await userPreflight(req)
  if (!app) app = await createRouter(basePath)

  let response = {}
  try {
    response = await app.routeAndRender(req, { ...state, ctx })
  }
  catch (error) {
    console.error(error)

    if (error.message === '404') {
      response.status = 404
      response.html = app.render(
        '<page-404></page-404>',
        { req, status: 404, error, state },
        { 'page-404': _404, ...app.elements },
      )
    }
    else {
      response.status = 500
      response.html = app.render(
        '<page-500></page-500>',
        { req, status: 500, error, state },
        { 'page-500': _500, ...app.elements },
      )
    }
  }

  // TODO: merge config.timers into response.headers

  response.html = fingerprintPublicRefs(response.html)

  return response
}

export const handler = arc.http(http)
