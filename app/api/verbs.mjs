export async function get () {
  return { json: { verb: 'get' } }
}

export async function head () {
  return { json: null }
}

export async function options () {
  return {
    headers: {
      'allow': 'OPTIONS, GET, HEAD, POST'
    }
  }
}

export async function post () {
  return { json: { verb: 'post' } }
}

export async function put () {
  return { json: { verb: 'put' } }
}

export async function patch () {
  return {
    headers: {
      'ETag': 'e0023aa4f'
    }
  }
}

export async function destroy () {
  return { json: { verb: 'delete' } }
}
