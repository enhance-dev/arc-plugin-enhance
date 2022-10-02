// 1. Save epoch time stamp in env as cache version
// 2. Add that cache version to a previous versions list 
//    This list could also be kept in the env as json 
//    so that you don't have to read from disk
// 3. Replace "/_public/" with cache ID
// 4. 

let path = require('path')

let bundles = require('@architect/plugin-bundles')
let styles = require('@enhance/arc-plugin-styles')

let rootCatchallSrcDir = path.join(__dirname, '..', 'http', 'any-catchall')
let staticAssetSrcDir = path.join(__dirname, '..', 'http', 'get-_public-catchall')


module.exports = {
  

  sandbox: {
    async start (params) {
      await bundles.sandbox.start(params)
      await styles.sandbox.start(params)
    }
  },

  deploy: {
    async start (params) {
      await bundles.deploy.start(params)
      await styles.deploy.start(params)
    }
  },

  set: {
    env() {
      return {
        ENHANCE_CACHE_ID: Date.now()
      }
    },

    /** frontend logic will *only* be shared w ANY and GET handlers */
    views ({inventory}) {
      const cwd = inventory.inv._project.cwd 
      return {
        src: path.join(cwd,'app')
      }
    },

    /** we want to share models business logic across all lambdas */
    shared ({inventory}) {
      const cwd = inventory.inv._project.cwd 
      return {
        src: path.join(cwd,'models')
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
