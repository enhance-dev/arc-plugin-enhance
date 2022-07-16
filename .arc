@app
thrasher

@static
fingerprint true

@http

@views
src app

@plugins
architect/plugin-bundles
beginner

@bundles
store 'node_modules/@enhance/store'

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
