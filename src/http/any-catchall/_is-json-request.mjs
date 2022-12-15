/** helper to check if the user-agent requested json */
export default function requestedJSON (headers) {
  let accept = headers['accept'] || headers['Accept']
  let ctype = headers['content-type'] || headers['Content-Type']
  let value = accept || ctype
  if (value) {
    return value.startsWith('application/json') || value.startsWith('text/json')
  }
  return false
}
