import path from 'path'
import url from 'url'
import plur from 'pluralize'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
//
// ... request path .......... filesystem path ..................... element name
// -----------------------------------------------------------------------------
// ... /foobar ............... pages/foobar.mjs .................... page-foobar
// ... /foo/bar/baz .......... pages/foo/bar/baz.mjs ............... page-foo-bar-baz
// ... /foo/bar .............. pages/foo/bar/index.mjs ............. page-foo-bar
// ... /people/13 ............ pages/users/$id.mjs ................. page-user
// ... /people/13/things ..... pages/users/$id/things.mjs .......... page-user-things ???
// ... /people/13/things/4 ... pages/users/$id/things/$thingID.mjs . page-user-thing ???
//
export default function getPageName (template) {
  // if we have a template we can derive the expected element name
  if (template) return fmt(template)
  // otherwise we are 404
  return false
}

/** serialize template name to element name */
function fmt (templatePath) {
  let base = path.join(__dirname, 'node_modules', '@architect', 'views', 'pages')
  let raw = templatePath.replace(base, '').replace(/\.mjs/g, '').replace('/', '').replace(/\//g, '-')
  // if there are dynamic parts we need to do some additional formatting
  if (raw.includes('$')) {
    let parts = raw.split('-')
    let result = []
    let index = 0
    for (let p of parts) {
      // check if part is dynamic
      if (p.startsWith('$') === false) {
        // lookahead to the next part
        let next = parts[index + 1]
        if (next && next.startsWith('$')) {
          // singularize if it is dynamic
          result.push(plur.singular(p))
        }
        else {
          // otherwise concat and move on
          result.push(p)
        }
      }
      index += 1
    }
    return result.join('-')
  }
  return raw.replace('-index', '')
}
