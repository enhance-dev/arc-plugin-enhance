let { extname } = require('path')
let HTMLorJSON = [ 'htm', 'html', 'json', 'shtml' ]
module.exports = function isHTMLorJSON (filename) {
  if (!filename || !extname(filename)) return false
  let ext = extname(filename).substr(1)
  return HTMLorJSON.includes(ext)
}
