import asap from '@architect/asap'

export async function handler (req) {
  req.rawPath = req.rawPath.replace('/_public', '')
  const response = await asap()(req)
  const size = response?.body?.length
  if (size > 5500000) {      // 5.5MB
    return {
      statusCode: 302,
      headers: { Location: `/_static${req.rawPath}` }
    }
  }
  return response
}
