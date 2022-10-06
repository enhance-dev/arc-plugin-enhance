import path from 'path'
import url from 'url'
import arc from '@architect/functions'
import router from './router.mjs'
import asap from '@architect/asap'

export function createRouter (base) {
  if (!base) {
    let here = path.dirname(url.fileURLToPath(import.meta.url))
    base = path.join(here, 'node_modules', '@architect', 'views')
  }
  return arc.http.async(asap({ passthru: true }),router.bind({}, base))
}

export const handler = createRouter() 
