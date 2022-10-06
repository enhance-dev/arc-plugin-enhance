import fs from 'fs'
import path from 'path'
import url from 'url'
const _local = process.env.ARC_ENV==='testing'

let manifest = {}
if (!_local) {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  try {
    const manifestFile = fs.readFileSync(path.join(__dirname, 'node_modules', '@architect', 'shared', 'static.json'))
    manifest = JSON.parse(manifestFile)
  } catch (e) {
    console.log('no replacement manifest found')
  }
}

function replaceEvery(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(re, function (matched) {
    return mapObj[matched];
  });
}

let manifestMap = {}
const mapEntries = Object.entries(manifest)
mapEntries.forEach(file => {
  manifestMap[`${file[0]}`] = `${file[1]}`
})
export default function (str) {
  if (mapEntries.length === 0) {
    return str
  } else {
    return replaceEvery(str, manifestMap)
  }
}