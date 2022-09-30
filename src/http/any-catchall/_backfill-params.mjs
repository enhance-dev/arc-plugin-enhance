import path from 'path'

import { pathToRegexp } from 'path-to-regexp'

/** adds url params back in */
export default function backfill (basePath, apiPath, pagePath, req) {

  // get a clean copy of the params
  let { params, ...copy } = { ...req }

  // get the regexp for the given path
  let base = apiPath? path.join(basePath, 'api') : path.join(basePath, 'pages')
  let tmpl = apiPath? apiPath : pagePath

  tmpl = tmpl.replace(base, '')
    .replace(/index\.mjs|\.mjs/, '')
    .replace(/(\/?)\$\$\/?$/, '$1(.*)')
    .replace('$', ':')
    .replace(/\/+$/, '')
  let pattern = pathToRegexp(tmpl)

  // resolve matches with param names in tmpl
  let matches = copy.rawPath.match(pattern)
  let parts = tmpl.split('/').filter((p) => p.startsWith(:))
  parts.forEach((p, index) => {
    params[p.replace(':', '')] = matches[index+1]
  })
  return params
}
