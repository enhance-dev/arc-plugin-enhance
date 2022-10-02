import arc from '@architect/functions'
import asap from './enhance-static/asap.js'
// import fs from 'fs'
// import path from 'path'
// import url from 'url'

export function assetProxy() {
  const config = {
    cacheControl: 'max-age=0, must-revalidate',
  }
  return arc.http.async( asap(config))
}

export const handler = assetProxy() 
