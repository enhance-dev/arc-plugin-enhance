import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export default async function getFile ({ basePath = '', fileName }) {
  const localPath = join(basePath, fileName)

  if (existsSync(localPath)) {
    try {
      const { default: fn } = await import(pathToFileURL(localPath).href)
      return fn
    }
    catch (error) {
      throw new Error(`Issue when trying to import ${fileName}: ${localPath}`, { cause: error })
    }
  }
}

