let path = require('path')

module.exports = { 
  set: {
    http () {
      let src = path.join(__dirname, '..', 'http', 'any-catchall')
      return [
        { method: 'any', path: '/*', src }
      ]
    }
  } 
}
