import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const manifestFile = fs.readFileSync(path.join(__dirname,'.replacement-manifest.json'))
const manifest = JSON.parse(manifestFile)

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

let manifestMap = {}
Object.entries(manifest).forEach(file => {
  manifestMap[`_public/${file[0]}`]=`_public/${file[1]}` 
})
export default function(str) {
  return replaceAll(str,manifestMap)
}