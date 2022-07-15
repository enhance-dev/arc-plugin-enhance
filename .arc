@app
thrasher

@static
fingerprint true

@views
src app

@http
/*
  method any
  src .begin/http/any-catchall

@plugins
architect/plugin-bundles

@bundles
store 'node_modules/@enhance/store'

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
