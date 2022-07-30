import glob from 'glob'
import { join } from 'path'

let cache = false

/** helper to return files from basePath */
export default function getFiles (basePath, folder) {
  if (!cache) {
    const filesOnly = f => f.split('/').pop().includes('.')
    const expr = basePath + '/**'
    cache = glob.sync(expr, { dot: false }).filter(filesOnly)
  }
  const base = join(basePath, folder)
  const requestedFolder = f => f.startsWith(base)
  return cache.filter(requestedFolder)
}
