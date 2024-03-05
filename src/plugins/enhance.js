const { join } = require('path')
const rollup = require('@enhance/arc-plugin-rollup')

module.exports = {
  sandbox: {
    async start (params) {
      await rollup.sandbox.start(params)
    },

    async watcher (params) {
      await rollup.sandbox.watcher(params)
    }
  },

  deploy: {
    async start (params) {
      await rollup.deploy.start(params)
    }
  },

  set: {
    static () {
      return {
        fingerprint: true,
        prune: true
      }
    },

    /** frontend logic will *only* be shared w ANY and GET handlers */
    views ({ inventory }) {
      const cwd = inventory.inv._project.cwd
      return {
        src: join(cwd, 'app')
      }
    },

    /** we want to share models business logic across all lambdas */
    shared ({ inventory }) {
      const cwd = inventory.inv._project.cwd
      return {
        src: join(cwd, 'shared')
      }
    },

    /**
     * sets up a greedy lambda for the frontend
     *
     * - userland can still add routes to override this!
     * - makes single responsibility functions an opt-in rather than up front cost
     */
    http () {
      let rootCatchallSrcDir = join(__dirname, '..', 'http', 'any-catchall')
      let staticAssetSrcDir = join(__dirname, '..', 'http', 'get-_public-catchall')
      return [
        {
          method: 'any',
          path: '/*',
          src: rootCatchallSrcDir,
        },
        {
          method: 'get',
          path: '/_public/*',
          src: staticAssetSrcDir,
          config: {
            // shared: false, // TODO ensure static.json remains, but shared is cleared out
            views: false,
          }
        },
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
    },


    env ({ arc }) {
      let elements = arc['enhance-elements'] || []
      return {
        ELEMENTS: elements
      }
    }
  }

}

