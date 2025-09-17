import fs from 'fs'
import path from 'path'
import url from 'url'
const _local = process.env.ARC_ENV === 'testing' || process.env.ARC_LOCAL

let manifest = {}
if (!_local) {
  const dirPath = new URL('.', import.meta.url)
  const __dirname = url.fileURLToPath(dirPath)
  const filePath = path.join(__dirname, 'node_modules', '@architect', 'shared', 'static.json')
  if (fs.existsSync(filePath)) {
    try {
      const manifestFile = fs.readFileSync(filePath)
      manifest = JSON.parse(manifestFile)
    }
    catch (e) {
      console.error('Static manifest parsing error', e)
    }
  }
}
function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
export function replaceEvery (str, mapObj) {
  const re = new RegExp(Object.keys(mapObj).sort().reverse().map(i => escapeRegExp(i)).join('|'), 'gi')

  return str.replace(re, function (matched) {
    return mapObj[matched]
  })
}

let manifestMap = {}
const mapEntries = Object.entries(manifest)
mapEntries.forEach(file => {
  manifestMap[`_public/${file[0]}`] = `_public/${file[1]}`
})
export default function (str) {
  if (mapEntries.length === 0) {
    return str
  }
  else {
    return replaceEvery(str, manifestMap)
  }
}
