import asap from '@architect/asap'

export async function handler (req) {
  req.rawPath = req.rawPath.replace('/_public', '')
  return asap()(req)
}
