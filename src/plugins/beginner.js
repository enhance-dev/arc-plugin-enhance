let path = require('path')

module.exports = { 
  set: {

    static () {
      return {
        fingerprint: true
      }
    },

    views () {
      return {
        src: 'app'
      }
    },
    
    http () {
      let src = path.join(__dirname, '..', 'http', 'any-catchall')
      return [
        { method: 'any', path: '/*', src }
      ]
    },

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
  }
}
