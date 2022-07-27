import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import glob from 'glob'
import { pathToRegexp } from 'path-to-regexp'

import sorter from './_sorter.mjs'

// cheap memoize for warm lambda
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cache = {} 
const filesOnly = f => f.split('/').pop().includes('.')

export default function getModule (basePath, folder, route) {

  if (!cache[folder])
    cache[folder] = {}

  if (!cache[folder][route]) {
  
    let base = path.join(basePath, folder)
    let raw = glob.sync(base + '/**', { dot: false }).filter(filesOnly).sort(sorter)

    let clean = f => f.replace(base, '').replace(/index\.html|index\.mjs|\.mjs|\.html/, '').replace('$', ':').replace(/\/+$/, '')
    let copy = raw.slice(0).map(clean).map(p => pathToRegexp(p))

    let index = 0
    let found = false
 
    for (let r of copy) {
      let result = r.test(route)
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
