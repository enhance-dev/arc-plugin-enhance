import path from 'path'

/** helper to get page element name */
//
// ... request path .......... filesystem path ..................... element name
// -----------------------------------------------------------------------------
// ... /foobar ............... pages/foobar.mjs .................... page-foobar
// ... /foo/bar/baz .......... pages/foo/bar/baz.mjs ............... page-foo-bar-baz
// ... /foo/bar .............. pages/foo/bar/index.mjs ............. page-foo-bar
// ... /people/13 ............ pages/users/$id.mjs ................. page-users--id
// ... /people/13/things ..... pages/users/$id/things.mjs .......... page-users--id-things
// ... /people/13/things/4 ... pages/users/$id/things/$thingID.mjs . page-users--id-things--thingid
// ... /one/three/four ....... pages/$$.mjs ........................ page---
// ... /one/two .............. pages/$$.mjs ........................ page---
// ... /one .................. pages/$dyn.mjs ...................... page--dyn
//
export default function getPageName (basePath, template) {
  // if we have a template we can derive the expected element name
  if (template) return fmt(basePath, template)
  // otherwise we are 404
  return false
}

/** serialize template name to element name */
function fmt (basePath, templatePath) {
  let base = path.join(basePath, 'pages')
  let raw = templatePath.replace(base, '')
    .replace(/\.mjs/g, '')
    .replace(path.sep, '')
    .replace(new RegExp('\\' + path.sep, 'g'), '-')
    .replace(/\$/g, '-') // replace dynamic markers with extra dashes to ensure unique element names
    .replace('-index', '')
    .toLowerCase() // custom elements can't have capital letters
  return raw
}
