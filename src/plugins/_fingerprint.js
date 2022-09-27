const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild');

// 1. List all static files

function getFilesRecursively(directory, skip = []) {
  let files = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory() && !skip.includes(file)) {
      files = [...files, ...getFilesRecursively(absolute, skip)];
    } else {
      files.push(absolute);
    }
  }
  return files
}


module.exports = function (publicDir) {

  // TODO: make this point to the inventory public folder
  const filterOutFiles = ['.gitignore']
  const filterOutExtensions = ['']
  const staticFiles = getFilesRecursively(publicDir, ['_public'])
    .filter(file => !filterOutFiles.includes(path.basename(file)))
    .filter(file => !filterOutExtensions.includes(path.extname(file)))

  // 2. Create Static Manifest 
  let staticManifest = {}
  staticFiles.forEach(file => {
    const partialPath = file.slice(publicDir.length + 1)
    const aliasPath = path.join('_public', partialPath)
    staticManifest['/' + aliasPath] = '/' + partialPath
  })
  // 3. Bundle and fingerprint files
  const commonMimeTypes = require('@architect/asap/src/lib/common-mime-types')
  let loader = {}
  Object.keys(commonMimeTypes).filter(ext => !['js', 'mjs'].includes(ext)).forEach(ext => loader[`.${ext}`] = 'file')

  const publicBuildDir = path.join(publicDir, '_public')
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
    loader
  }
  const buildReport = esbuild.buildSync(config)

  // 4. Create Manifest of fingerprinted files
  let replaceManifest = {}
  const buildOutputs = buildReport.metafile.outputs
  const relToPublic = path.relative('.', publicDir) + path.sep
  const relToPublicBuild = path.relative('.', publicBuildDir) + path.sep
  // console.log({relToPublic})
  // console.log({relToPublicBuild})
  for (const [key, value] of Object.entries(buildOutputs)) {
    if (!value?.['entryPoint']) {
      replaceManifest[Object.keys(value.inputs)[0].replace(relToPublic, '')] = key.replace(relToPublicBuild, '')
    } else if (path.extname(key) !== path.extname(value.entryPoint)) {
      // no manifest entry
    } else if (
      key.replace(relToPublicBuild, '').replace(/\/?([^/]*)-[0-9A-Z]{8}.(.*)$/gm, '$1.$2')
      === value.entryPoint.replace(relToPublic, '')) {
      replaceManifest[value.entryPoint.replace(relToPublic, '')] = key.replace(relToPublicBuild, '')

    }
  }

  const staticManifestFile = path.join(publicBuildDir, 'static-manifest.json')
  const replacementManifestFile = path.join(publicBuildDir, 'replacement-manifest.json')
  fs.writeFileSync(staticManifestFile, JSON.stringify(staticManifest))
  fs.writeFileSync(replacementManifestFile, JSON.stringify(replaceManifest))

  // 5. Add gitignore TODO:
}