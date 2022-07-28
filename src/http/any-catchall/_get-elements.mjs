import glob from 'glob'
import { join } from 'path'
import { existsSync as exists } from 'fs'
import getPageName from './_get-page-name.mjs'

const ls = glob.sync

/**
 * - files in /elements must be lowcase dasherized to match tag name
 * - nested elements will use directory names (eg: /elements/foo/bar.mjs is foo-bar.mjs)
 * - TODO elements.mjs has key for each page
 * - TODO can run a command to generate it based on app/elements
 */
export default async function getElements (basePath) {

  let pathToModule = join(basePath, 'elements.mjs')
  let pathToPages = join(basePath, 'pages')
  let pathToElements = join(basePath, 'elements')

  if (exists(pathToModule)) {
    // read explicit elements manifest
    let els = await import(pathToModule)
    return els.default
  }
  else if (exists(pathToElements)) {

    // generate elements manifest
    let els = {}

    // read all the pages
    let pages = ls(pathToPages + '/**').filter(f => f.includes('.mjs'))
    for (let p of pages) {
      let tag = await getPageName(basePath, p)
      let mod = await import(p)
      els['page-' + tag] = mod.default
    }

    // read all the elements
    let files = ls(pathToElements + '/**').filter(f => f.includes('.mjs'))
    for (let e of files) {
      // turn foo/bar.mjs into foo-bar to make sure we have a legit tag name
      let tag = e.replace(basePath + '/elements/', '').replace('.mjs', '').replace('/', '-')
      if (/^[a-z][a-z0-9-]*$/.test(tag) === false) {
        throw Error(`Illegal element name "${tag}" must be lowercase alphanumeric dash`)
      }
      // import the element and add to the map
      let mod = await import(e)
      els[tag] = mod.default
    }
    return els
  }
  else {
    // generate based on page.html or page.mjs requested
    throw Error('cannot find `elements.mjs` or an `elements/` folder')
  }
}

