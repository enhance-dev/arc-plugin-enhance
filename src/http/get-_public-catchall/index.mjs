import arc from '@architect/functions'
import localAsap from './enhance-static/asap.js'

export function assetProxy() {
  return arc.http.async(localAsap())
}

export const handler = assetProxy() 
