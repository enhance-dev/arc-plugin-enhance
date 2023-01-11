import path from 'path'
import { pathToFileURL } from 'url'

import { pathToRegexp } from 'path-to-regexp'

import getFiles from './_get-files.mjs'
import sort from './_sort-routes.mjs'
import clean from './_clean.mjs'

// cheap memoize for warm lambda
const cache = {}

/** helper to get module for given folder/route */
export default function getModule (basePath, folder, route) {
  if (!cache[basePath])
    cache[basePath] = {}

  if (!cache[basePath][folder])
    cache[basePath][folder] = {}

  if (!cache[basePath][folder][route]) {

    let raw = getFiles(basePath, folder).sort(sort)
    let base = path.join(basePath, folder)
    let basePathname = pathToFileURL(base).pathname
    let copy = raw.slice(0).map(p => pathToFileURL(p).pathname).map(p => clean({ pathTmpl: p, base: basePathname, fileNameRegEx: /index\.html|index\.mjs|\.mjs|\.html/ })).map(p => pathToRegexp(p))

    let index = 0
    let found = false

    for (let r of copy) {
      if (r.test(route)) {
        found = raw[index]
        break
      }
      index += 1
    }

    if (found) {
      cache[basePath][folder][route] = found
    }
  }

  return cache[basePath][folder][route] || false
}
