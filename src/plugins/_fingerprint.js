const fs = require( 'fs')
const path = require('path')
const esbuild = require('esbuild');

// 1. List all static files
// const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function getFilesRecursively(directory,skip=[]) {
  let files = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory() && !skip.includes(file) ) {
        files = [...files,...getFilesRecursively(absolute,skip)];
    } else {
        files.push(absolute);
    }
  }
  return files
}

//const publicDir = path.join(__dirname, '..','..','public')

module.exports = function (publicDir) {

// TODO: make this point to the inventory public folder
const filterOutFiles = ['.gitignore']
const filterOutExtensions = ['']
const staticFiles = getFilesRecursively(publicDir, ['_public'])
  .filter(file => !filterOutFiles.includes(path.basename(file)))
  .filter(file => !filterOutExtensions.includes(path.extname(file)))

// // 2a. Copy pre fingerprinted files
// fs.mkdirSync(path.join(publicDir,'_public'),{recursive:true})
// staticFiles.forEach(file => {
//   const newFile = path.join(publicDir,'_public',path.relative(publicDir,file))
//   fs.copyFileSync(file,newFile)
// })

// 2b. Create Manifest 
let staticManifest = {}
staticFiles.forEach(file => {
  const partialPath = file.slice(publicDir.length+1)
  staticManifest[partialPath]=partialPath
})
// 3. Bundle and fingerprint files
const publicBuildDir = path.join(publicDir,'_public')
const config = {
  bundle: true,
  metafile: true,
  outdir: publicBuildDir,
  outbase: publicBuildDir,
  outExtension: { '.js': '.mjs' },
  format: 'esm',
  entryPoints: staticFiles,
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  // TODO: Add loader for all file types to be fingerprinted
  loader: {
    '.png': 'file',
    '.svg': 'file',
    '.css': 'file',
    '.jpg': 'file',
  }
}
const buildReport = esbuild.buildSync(config)

// 4. Create Manifest of fingerprinted files
let fingerprintedAssets = {}
let replaceManifest = {}
const buildOutputs = buildReport.metafile.outputs
const relToPublic = path.relative('.',publicDir)+path.sep
const relToPublicBuild = path.relative('.',publicBuildDir)+path.sep
// console.log({relToPublic})
// console.log({relToPublicBuild})
for (const [key, value] of Object.entries(buildOutputs)) {
  if (!value.hasOwnProperty('entryPoint')) {
    fingerprintedAssets[key.replace(relToPublicBuild,'')]= key.replace(relToPublicBuild,'')
    replaceManifest[Object.keys(value.inputs)[0].replace(relToPublic,'')] = key.replace(relToPublicBuild,'')
  } else if (path.extname(key) !== path.extname(value.entryPoint)) {
    // no manifest entry
  } else if (
    key.replace(relToPublicBuild, '').replace(/\/?([^/]*)-[0-9A-Z]{8}.(.*)$/gm, '$1.$2')
    === value.entryPoint.replace(relToPublic, '')) {
      fingerprintedAssets[key.replace(relToPublicBuild,'')]= key.replace(relToPublicBuild,'')
      replaceManifest[value.entryPoint.replace(relToPublic,'')] = key.replace(relToPublicBuild,'')

  }
}

const staticManifestFile = path.join(publicBuildDir,'static-manifest.json')
const replacementManifestFile = path.join(publicBuildDir,'replacement-manifest.json')
const fingerprintedManifestFile = path.join(publicBuildDir,'fingerprinted-manifest.json')
fs.writeFileSync(staticManifestFile,JSON.stringify(staticManifest))
fs.writeFileSync(replacementManifestFile,JSON.stringify(replaceManifest))
fs.writeFileSync(fingerprintedManifestFile,JSON.stringify(fingerprintedAssets))



// 5. Add gitignore TODO:
}