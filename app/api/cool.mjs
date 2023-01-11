export let get = [ one, two ]

async function one (req) {
  req.value = 'some value'
  console.log('hi from one')
}

async function two (req) {
  console.log(req.value)
  return {
    json: 'apples oranges'.split()
  }
}
