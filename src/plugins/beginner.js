let path = require('path')
let bundles = require('@architect/plugin-bundles')
let styles = require('@enhance/arc-plugin-styles')

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

    static () {
      return {
        fingerprint: true
      }
    },

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
     * - makes single responsiblity functions an opt-in rather than up front cost
     */
    http () {
      let src = path.join(__dirname, '..', 'http', 'any-catchall')
      return [
        { method: 'any', path: '/*', src }
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
