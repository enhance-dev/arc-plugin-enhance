import getModule from './_get-module.mjs'
import path from 'path'
import url from 'url'
import { pathToRegexp } from 'path-to-regexp'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default async function api (req) {

  // if the route matches api/path/to/thing then we are running this function
  let apiPath = getModule('api', req.rawPath)
  if (apiPath) {
    
    // only import if the module exists and only run if export equals httpMethod
    let mod = await import(apiPath)
    let method = mod[req.method.toLowerCase()]
    if (method) {
      // check to see if we need to modify the req and add in params
      req.params = backfill(req)

      // grab the state from the app/api route
      let state = await method(req)
      let json = requestedJSON(req.headers)
      if (json) {
        delete state.location
        return state
      }

      // if route requested:
      // - is a GET
      // - and has pages/path/to/thing then pass state thru middleware
      let appPath = getModule('pages', req.rawPath)
      if (appPath && req.method.toLowerCase() === 'get') {
        req.page = appPath
        req.state = state.json
      }
      else {
        // otherwise defer to the api route
        return state
      }
    }
  }
}

/** helper to check if the user-agent requested json */
function requestedJSON (headers) {
  let accept = headers['accept'] || req.headers['Accept']
  if (accept)
    return accept.startsWith('text/json') || accept.startsWith('application/json')
  return false
}

/** adds url params back in */
function backfill (req) {
  // get a clean copy of the params
  let { params, ...copy } = { ...req }

  // get the regexp for the given path
  let tmpl = getModule('api', req.rawPath)
  let base = path.join(__dirname, 'node_modules', '@architect', 'views', 'api')
  if (!tmpl) {
    tmpl = getModule('pages', req.rawPath)
    base = path.join(__dirname, 'node_modules', '@architect', 'views', 'pages')
  }
  tmpl = tmpl.replace(base, '').replace(/index\.mjs|\.mjs/, '').replace('$', ':').replace(/\/+$/, '')
  let pattern = pathToRegexp(tmpl)

  // resolve matches with param names in tmpl
  let matches = copy.rawPath.match(pattern)
  let parts = tmpl.split('/').filter(Boolean)
  let index = 0
  for (let p of parts) {
    if (p.startsWith(':')) {
      params[p.replace(':', '')] = matches[index]
    }
    index += 1
  }
  return params
}

