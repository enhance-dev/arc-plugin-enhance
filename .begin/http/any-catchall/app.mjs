import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { existsSync, readFileSync } from 'fs'

import arc from '@architect/functions'
import Head from '@architect/views/head.mjs'
import elements from '@architect/views/elements.mjs'
import enhance from '@enhance/ssr'
import importTransform from '@enhance/import-transform'
import styleTransform from '@enhance/enhance-style-transform'

import getPageName from './_get-page-name.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function app (req) {

  // the name of the page we are looking for
  const title = getPageName(req.rawPath)

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
    let head = Head({ title })
    let body = html`${ head }<page-${ title }></page-${ title }>`
    return { html: body }
  }
  catch (err) {
    const head = Head({ title: '500' })
    const body = html`${ head }<page-500 error="${err}"></page-500>`
    return { html: body }
  }
}
