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
import getPageName from './_get-page-name.mjs'
import getElements from './_get-elements.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function app (basePath, req) {

  let elements = await getElements(basePath)

  if (!elements['page-404']) 
    elements['page-404'] = _404

  if (!elements['page-500'])
    elements['page-500'] = _500

  let pathToHead = join(basePath, 'head.mjs')
  let head = existsSync(pathToHead) === false? _head : await import(pathToHead)

  // the name of the page we are looking for
  const title = getPageName(basePath, req.page)

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

  try {
    let body = html`${ head({ title:'' }) }<page-${ title }></page-${ title }>`
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
