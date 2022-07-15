import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { existsSync, readFileSync } from 'fs'

import arc from '@architect/functions'
import Head from '@architect/views/head.mjs'
import elements from '@architect/views/elements.mjs'
import enhance from '@enhance/ssr'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import getModule from './_get-module.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function app (req) {

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
    req.page = getModule('pages', req.rawPath)
  }

  if (!req.page) {
    const head = Head({ title: '404' })
    const body = html`${ head }<page-404 error="${req.rawPath} not found"></page-404>`
    return { html: body }
  }

  if (req.page.includes('.html')) {
    try {
      let head = Head({ title: '' })
      let raw = readFileSync(req.page).toString()
      let body = html`${ head }${ raw }`
      return { html: body }
    }
    catch (err) {
      const head = Head({ title: '500' })
      const body = html`${ head }<page-500 error="${ err.message }" stack="${ err.stack }"></page-500>`
      return { html: body }
    }
  }
}
