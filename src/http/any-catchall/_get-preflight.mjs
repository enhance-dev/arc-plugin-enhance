import fs from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'

export default async function GetPreflight({ basePath = '' }) {
  const localPath = join(basePath, 'preflight.mjs')
  if (fs.existsSync(localPath)) {
    const { default: preflight } = await import(pathToFileURL(localPath).href)
    return preflight
  }
}

