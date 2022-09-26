import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
let manifest = {}
try {
  const manifestFile = fs.readFileSync(path.join(__dirname,'.replacement-manifest.json'))
  manifest = JSON.parse(manifestFile)
} catch (e) {
  console.log('no replacement manifest found')
}

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

let manifestMap = {}
const mapEntries = Object.entries(manifest)
mapEntries.forEach(file => {
  manifestMap[`_public/${file[0]}`]=`_public/${file[1]}` 
})
export default function(str) {
  if (mapEntries.length===0) {
    return str
  } else {
    return replaceAll(str,manifestMap)
  }
}