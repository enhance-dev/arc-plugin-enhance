/** helper to check if the user-agent requested json */
export default function requestedJSON (headers) {
  let accept = headers['accept'] || req.headers['Accept']
  if (accept)
    return accept.startsWith('text/json') || accept.startsWith('application/json')
  return false
}
