import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { existsSync, readFileSync } from 'fs'

import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import _head from './_head.mjs'
import _404 from './_404.mjs'
import _500 from './_500.mjs'
import getModule from './_get-module.mjs'
import getElements from './_get-elements.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function app (basePath, req) {

  let elements = await getElements(basePath)

  if (!elements['page-404']) 
    elements['page-404'] = _404

  if (!elements['page-500'])
    elements['page-500'] = _500

  let pathToHead = join(basePath, 'head.mjs')
  let head = existsSync(pathToHead) === false? _head : (await import(pathToHead)).default

  const html = enhance({
    elements,
    scriptTransforms: [
      importTransform({ map: arc.static })
    ],
    styleTranstforms: [
      styleTransform
    ],
    initialState: req.state || {}
  })

  // the name of the page we are looking for
  if (!req.page) {
    req.page = getModule(basePath, 'pages', req.rawPath)
  }

  if (!req.page) {
    const body = html`${ head({ title: '404' })}<page-404 error="${req.rawPath} not found"></page-404>`
    return { html: body }
  }

  if (req.page.includes('.html')) {
    try {
      let raw = readFileSync(req.page).toString()
      let body = html`${ head({ title:'' }) }${ raw }`
      let res = { html: body }
      if (req.pageSession) 
        res.session = req.pageSession
      return res
    }
    catch (err) {
      const body = html`${ head({ title: '500' })}<page-500 error="${ err.message }" stack="${ err.stack }"></page-500>`
      return { html: body }
    }
  }
}
