import router from './router.mjs'

export default async function render (basePath, rawPath, session) {
  return router(basePath, {
    rawPath,
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
    session
  })
}
