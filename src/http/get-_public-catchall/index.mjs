import arc from '@architect/functions'
import asap from '@architect/asap'
// import fs from 'fs'
// import path from 'path'
// import url from 'url'

// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const staticAliasFile = fs.readFileSync(path.join(__dirname, '.static-manifest.json'))
// const staticAliases = JSON.parse(staticAliasFile)

export function assetProxy() {

  // const fingerprinted = {
  //   passthru: true,
  //   cacheControl: 'max-age=31536000',
  // }
  // const notFingerprinted = {
  //   alias: staticAliases,
  //   cacheControl: 'max-age=0, must-revalidate',
  // }
  function stripPath(req) {
    req.rawPath = req.rawPath.replace('/_public','')
  }
  return arc.http.async(stripPath,asap())
  // return arc.http.async(asap(fingerprinted), asap(notFingerprinted))
}

export const handler = assetProxy() 
