let { existsSync, readFileSync } = require('fs')
let { extname, join, sep } = require('path')
let crypto = require('crypto')

let commonMimeTypes = require('../lib/common-mime-types')
let binaryExts = require('../lib/binary-extensions')
let { httpError } = require('../lib/error')
let templatizeResponse = require('../format/templatize')
let normalizeResponse = require('../format/response')
let pretty = require('./_pretty')

/**
 * asap.read (local)
 *
 * Reads a file from the local filesystem, resolving an HTTP Lambda friendly payload
 *
 * @param {Object} params
 * @param {String} params.Key
 * @param {String} params.IfNoneMatch
 * @param {String} params.isFolder
 * @param {Object} params.config
 * @returns {Object} { statusCode, headers, body }
 */
module.exports = async function readLocal (params) {

  let { Key, IfNoneMatch, isFolder, config } = params
  let { ARC_STATIC_BUCKET, ARC_STATIC_PREFIX: staticPrefix } = process.env
  let headers = {}
  let response = {}

  // After 6.x we can rely on this env var in sandbox
  let sandboxPath = config.sandboxPath || ARC_STATIC_BUCKET

  // Unlike S3, handle sandboxPath and assets inside the function as Sandbox is long-lived
  let staticAssets
  let staticManifest = join(sandboxPath, 'static.json')
  if (existsSync(staticManifest)) {
    staticAssets = JSON.parse(readFileSync(staticManifest))
  }
  let assets = config.assets || staticAssets

  // Look up the blob
  // Assume we're running from a lambda in src/**/* OR from vendored node_modules/@architect/sandbox
  let filePath = join(sandboxPath, Key)
  // Denormalize static folder for local paths (not something we'd do in S3)
  if (staticPrefix && filePath.includes(staticPrefix)) {
    filePath = filePath.replace(`${staticPrefix}${sep}`, '')
  }

  try {
    // If client sends If-None-Match, use it in S3 getObject params
    let matchedETag = false

    // If the static asset manifest has the key, use that, otherwise fall back to the original Key
    let contentType = commonMimeTypes[extname(Key).substr(1)] || 'application/octet-stream'

    if (!existsSync(filePath)) {
      if (config.passthru) return null
      return await pretty({ Key: filePath, config, isFolder, sandboxPath })
    }

    response.body = readFileSync(filePath)
    let ETag = crypto.createHash('sha256').update(response.body).digest('hex')
    let result = {
      ContentType: contentType,
      ETag,
    }
    if (IfNoneMatch === ETag) {
      matchedETag = true
      headers.etag = IfNoneMatch
      response = {
        statusCode: 304,
        headers,
      }
    }

    // No ETag found, return the blob
    if (!matchedETag) {
      let isBinary = binaryExts.includes(extname(Key).substr(1))

      // Handle templating
      response = templatizeResponse({
        isBinary,
        assets,
        response,
        isLocal: true,
      })

      // Normalize response
      response = normalizeResponse({
        response,
        result,
        Key,
        config,
      })

      // Add ETag
      response.headers.etag = result.ETag
    }

    if (!response.statusCode) {
      response.statusCode = 200
    }

    return response
  }
  catch (err) {
    console.log(err)
    let notFound = err.name === 'NoSuchKey'
    if (notFound) {
      if (config.passthru) return null
      return pretty({ Key: filePath, config, isFolder, sandboxPath })
    }
    else {
      let title = err.name
      let message = `
        ${err.message}<br>
        <pre>${err.stack}</pre>
      `
      return httpError({ statusCode: 500, title, message })
    }
  }
}
