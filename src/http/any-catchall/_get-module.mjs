import fs from 'fs'
import path from 'path'

import glob from 'glob'
import { pathToRegexp } from 'path-to-regexp'
import { fileURLToPath } from 'url'

// cheap memoize for warm lambda
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cache = {} 
const filesOnly = f => f.split('/').pop().includes('.')

export default function getModule (folder, route) {

  if (!cache[folder])
    cache[folder] = {}

  if (!cache[folder][route]) {
  
    let base = path.join(__dirname, 'node_modules', '@architect', 'views', folder)
    let raw = glob.sync(base + '/**', { dot: false }).filter(filesOnly)

    let clean = f => f.replace(base, '').replace(/index\.html|index\.mjs|\.mjs|\.html/, '').replace('$', ':').replace(/\/+$/, '')
    let copy = raw.slice(0).map(clean).map(p => pathToRegexp(p))
    let index = 0
    let found = false
 
    for (let r of copy) {
      if (r.test(route)) {
        found = raw[index]
        break
      } 
      index += 1
    }

    if (found) {
      cache[folder][route] = found
    }
  }

  return cache[folder][route] || false
}
