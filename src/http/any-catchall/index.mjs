import arc from '@architect/functions'
import api from './api.mjs'
import htm from './html.mjs'
import app from './app.mjs'

import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export function createRouter (base) {

  if (!base) {
    base = path.join(__dirname, 'node_modules', '@architect', 'views')
  }

  let one = api.bind({}, base)
  let two = htm.bind({}, base)
  let three = app.bind({}, base)

  return arc.http.async(one, two, three)
}

export const handler = createRouter() 
