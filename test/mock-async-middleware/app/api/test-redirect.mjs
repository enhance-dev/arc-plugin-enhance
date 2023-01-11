export let get = [ one, two ]

async function one (/* req */) {
  // should exit middleware and redirect to /login
  return {
    location: '/login'
  }
}

async function two (/* req */) {
  // should not enter via middleware
  throw 'Should never be reached.'
}
