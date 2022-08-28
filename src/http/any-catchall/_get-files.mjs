import glob from 'glob'
import { join } from 'path'

let cache = {}

/** helper to return files from basePath */
export default function getFiles (basePath, folder) {
  if (!cache[folder]) {
    let root = join(basePath, folder)
    let raw = glob.sync('/**', { dot: false, root })
    cache[folder] = raw.filter(f => f.includes('.'))
  }
  return cache[folder]
}
