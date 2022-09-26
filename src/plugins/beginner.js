let path = require('path')
let fs = require('fs')
let bundles = require('@architect/plugin-bundles')
let styles = require('@enhance/arc-plugin-styles')
let fingerprint = require('./_fingerprint')

let rootCatchallSrcDir = path.join(__dirname, '..', 'http', 'any-catchall')
let staticAssetSrcDir = path.join(__dirname, '..', 'http', 'get-_public-catchall')

function processAssets(params){
  const cwd = params.inventory.inv._project.cwd
  const publicFolderName = params.inventory.inv.static.folder
  const publicFolder = path.join(cwd,publicFolderName)
  const publicBuildFolder = path.join(publicFolder,'_public')
  //const viewsFolder = params.inventory.inv.views.src
  fingerprint(publicFolder)
  fs.copyFileSync(path.join(publicBuildFolder,'replacement-manifest.json'),
    path.join(rootCatchallSrcDir,'.replacement-manifest.json'))
  fs.copyFileSync(path.join(publicBuildFolder, 'static-manifest.json'),
    path.join(staticAssetSrcDir, '.static-manifest.json'))
  fs.copyFileSync(path.join(publicBuildFolder, 'fingerprinted-manifest.json'),
    path.join(staticAssetSrcDir, '.fingerprinted-manifest.json'))
}


module.exports = {

  sandbox: {
    async start (params) {
      await bundles.sandbox.start(params)
      await styles.sandbox.start(params)
      processAssets(params)
    }
  },

  deploy: {
    async start (params) {
      await bundles.deploy.start(params)
      await styles.deploy.start(params)
      processAssets(params)
    }
  },

  set: {

    /** frontend logic will *only* be shared w ANY and GET handlers */
    views () {
      return {
        src: 'app'
      }
    },

    /** we want to share models business logic across all lambdas */
    shared () {
      return {
        src: 'models'
      }
    },

    /**
     * sets up a greedy lambda for the frontend
     *
     * - userland can still add routes to override this!
     * - makes single responsibility functions an opt-in rather than up front cost
     */
    http () {
      return [
        { method: 'any', path: '/*', src:rootCatchallSrcDir },
        { method: 'get', path: '/_public/*', src:staticAssetSrcDir },
      ]
    },

    /** adds the begin/data data table */
    tables () {
      return {
        name: 'data',
        partitionKey: 'scopeID',
        partitionKeyType: 'string',
        sortKey: 'dataID',
        sortKeyType: 'string',
        ttl: 'TTL'
      }
    }

  // eof
  }
}
