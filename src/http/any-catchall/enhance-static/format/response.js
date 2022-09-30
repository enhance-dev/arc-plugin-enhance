// let mime = require('mime-types')
// let path = require('path')
let { compress } = require('./compress')
let isHTMLorJSON = require('../lib/is-html-json')

/**
 * Normalizes response shape
 */
module.exports = function normalizeResponse (params) {
  let { response, result, Key, contentEncoding, config } = params
  response.headers = response.headers || {}

  // Set content-type
  // Try headers, passed S3 / local metadata, otherwise default to octet
  response.headers['content-type'] =
    response.headers['content-type'] ||
    response.headers['Content-Type'] ||
    result && result.ContentType ||
    'application/octet-stream'

  // Set caching headers
  response.headers['cache-control'] =
    response.headers['cache-control'] ||
    response.headers['Cache-Control']

  if (config.cacheControl) {
    response.headers['cache-control'] = config.cacheControl
  }
  // Never cache HTML or JSON
  else if (isHTMLorJSON(Key)) {
    response.headers['cache-control'] = 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
  }
  else if (result && result.CacheControl) {
    response.headers['cache-control'] = result.CacheControl
  }
  else {
    response.headers['cache-control'] = 'public, max-age=0, must-revalidate'
  }

  // Probably unlikely to be seen via ASAP, but normalize header casing jic
  if (response.headers['Content-Type']) delete response.headers['Content-Type']
  if (response.headers['Cache-Control']) delete response.headers['Cache-Control']

  // Populate optional userland headers
  if (config.headers) {
    Object.keys(config.headers).forEach(h => response.headers[h.toLowerCase()] = config.headers[h])
  }

  if (contentEncoding) {
    response.body = compress(contentEncoding, response.body)
    response.headers['content-encoding'] = contentEncoding
  }
  // Base64 everything else on the way out to enable text + binary support
  response.body = Buffer.from(response.body).toString('base64')
  response.isBase64Encoded = true

  // Add ETag
  response.headers.etag = result.ETag

  return response
}
