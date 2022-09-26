import arc from '@architect/functions'
import asap from '@architect/asap'
import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const staticManifestFile = fs.readFileSync(path.join(__dirname,'.static-manifest.json'))
const fingerprintedManifestFile = fs.readFileSync(path.join(__dirname,'.fingerprinted-manifest.json'))
const staticManifest = JSON.parse(staticManifestFile)
const fingerprintedManifest = JSON.parse(fingerprintedManifestFile)

export function assetProxy () {
 
  const fingerprinted = {
    //assets: fingerprintedManifest,
    passthru: true,
    cacheControl: 'max-age=31536000',
  }
   const notFingerprinted = { 
    alias:{'/_public':'/'},
    //assets:staticManifest,
    cacheControl: 'max-age=0, must-revalidate',
  }
  // return arc.http.async(asap(fingerprinted),asap(notFingerprinted))
  return arc.http.async(asap(fingerprinted),asap(notFingerprinted))
}

export const handler = assetProxy() 
