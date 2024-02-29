import path from 'node:path'
import url from 'node:url'

import arc from '@architect/functions'
import loader from '@enhance/loader'
import core from '@enhance/core'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import { getState, head, preflight, postflight } from './helpers.mjs'
import _404 from './templates/404.mjs'
import _500 from './templates/500.mjs'
import _head from './templates/head.mjs'

const DEBUG = 1

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

let config = await loader({ basePath })

export async function createRouter (base) {
  if (base) config = await loader({ basePath: base })

  const app = core({
    ...config,
    ssrOptions: {
      scriptTransforms: [ importTransform({ lookup: arc.static }) ],
      styleTransforms: [ styleTransform ],
    },
    state: getState(),
    head,
    debug: DEBUG > 0,
  })

  return app
}

export const handler = (await createRouter()).routeAndRender
