let reader = require('./read')
let errors = require('./lib/error')

/**
 * Architect Static Asset Proxy
 *
 * @param config - object, for configuration
 * @param config.alias - object, map of root URLs to alias to other URLs (all should be root-rel)
 * @param config.assets - object, map of unfingerprinted filenames to fingerprinted filenames
 * @param config.env - string, arc environment; `testing` forces local reads
 * @param config.bucket - object, { staging, production } override S3 bucket names
 * @param config.bucket.staging - string, override the staging S3 bucket name
 * @param config.bucket.production - string, override the production S3 bucket name
 * @param config.bucket.folder - string, set an optional bucket folder to work within
 * @param config.cacheControl - string, set a custom cache-control header value
 * @param config.passthru - boolean, return null if no file is found
 * @param config.headers - object, map of custom response headers
 * @param config.sandboxPath - string, local filesystem path for Sandbox static assets
 * @param config.spa - boolean, forces index.html no matter the folder depth
 *
 * @returns HTTPLambda - an HTTP Lambda function that proxies calls to S3
 */
function asap (config = {}) {
  return async function handler (req) {
    let { ARC_ENV, ARC_STATIC_BUCKET, ARC_STATIC_SPA } = process.env
    let deprecated = req.version === undefined || req.version === '1.0'

    let isProduction = ARC_ENV === 'production'
    let path = deprecated ? req.path : req.rawPath
    let isFolder = path.split('/').pop().indexOf('.') === -1
    let Key // Assigned below

    /**
     * Bucket config
     */
    let configBucket = config.bucket
    let bucketSetting = isProduction
      ? configBucket && configBucket['production']
      : configBucket && configBucket['staging']
    // Ok, all that out of the way, let's set the actual bucket, eh?
    let needBucket = config.env !== 'testing'
    let Bucket = ARC_STATIC_BUCKET || bucketSetting
    if (!Bucket && needBucket) {
      return errors.proxyConfig
    }

    /**
     * Configure SPA + set up the file to be requested
     */
    let spa = ARC_STATIC_SPA === 'false'
      ? false
      : config && config.spa
    if (!spa) config.spa = false
    if (spa) {
      // If SPA: force index.html
      Key = isFolder ? 'index.html' : path.substring(1)
    }
    else {
      // Return index.html for root, otherwise pass the path
      let last = path.split('/').filter(Boolean).pop()
      let isFile = last ? last.includes('.') : false
      let isRoot = path === '/'

      Key = isRoot ? 'index.html' : path.substring(1) // Always remove leading slash

      // Append default index.html to requests to folder paths
      if (isRoot === false && isFile === false) {
        Key = `${Key.replace(/\/$/, '')}/index.html`
      }
    }

    /**
     * Alias - enable Keys to be manually overridden
     */
    let aliasing = config && config.alias && config.alias[path]
    if (aliasing) {
      Key = config.alias[path].substring(1) // Always remove leading slash
    }

    /**
     * REST API [deprecated]: flag `staging/`, `production/` requests
     */
    let rootPath
    let reqPath = req.requestContext && req.requestContext.path
    if (deprecated && reqPath) {
      if (reqPath && reqPath.startsWith('/staging/')) rootPath = 'staging'
      if (reqPath && reqPath.startsWith('/production/')) rootPath = 'production'
    }

    // Normalize if-none-match header to lower case; it may differ between environments
    let find = k => k.toLowerCase() === 'if-none-match'
    let IfNoneMatch = req.headers && req.headers[Object.keys(req.headers).find(find)]

    let read = reader({ env: config.env, sandboxPath: config.sandboxPath })
    return read({ Key, Bucket, IfNoneMatch, isFolder, config, rootPath })
  }
}

module.exports = asap
