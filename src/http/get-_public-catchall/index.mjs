import arc from '@architect/functions'
import asap from '@architect/asap'

export function assetProxy() {

  function stripPath(req) {
    req.rawPath = req.rawPath.replace('/_public', '')
  }
  return arc.http.async(stripPath, asap())
}

export const handler = assetProxy() 