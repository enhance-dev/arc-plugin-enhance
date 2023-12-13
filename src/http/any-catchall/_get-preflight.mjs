import { join } from 'path'
import { pathToFileURL } from 'url'

export default async function GetPreflight ({ basePath = '' }) {
  try {
    const pathToPreflight = pathToFileURL(join(basePath, 'preflight.mjs')).href
    const { default: preflight } = await import(pathToPreflight)
    return preflight
  }
  catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      return false
    }
    else {
      throw e
    }
  }
}

