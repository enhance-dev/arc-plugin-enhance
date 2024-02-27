import path from 'node:path'
import url from 'node:url'
import arc from '@architect/functions'
import router from './router.mjs'

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

export function createRouter (base) {
  base = base || basePath

  // return arc.http(router.bind({}, { basePath: base }))
}

export const handler = routeAndRender()
