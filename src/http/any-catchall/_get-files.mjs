import { globSync } from 'glob'
import { join } from 'path'

let cache = {}

/** helper to return files from basePath */
export default function getFiles (basePath, folder) {
  if (!cache[basePath]) cache[basePath] = {}
  if (!cache[basePath][folder]) {
    let root = join(basePath, folder)
    let raw = globSync('/**', { dot: true, root, nodir: true })
    let files = raw.filter(f => f.includes('.'))
    // Glob fixed path normalization, but in order to match in Windows we need to re-normalize back to backslashes (lol)
    let isWin = process.platform.startsWith('win')
    if (isWin) files = files.map(p => p.replace(/\//g, '\\'))
    cache[basePath][folder] = files
  }
  return cache[basePath][folder]
}
