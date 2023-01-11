import router from './router.mjs'

export default async function render (basePath, rawPath, session) {
  let res = await router({ basePath }, {
    rawPath,
    method: 'GET',
    headers: {
      'accept': 'text/html',
    },
    session
  })
  let location = rawPath
  return {
    location,
    session,
    json: {
      location,
      ...res
    }
  }
}
