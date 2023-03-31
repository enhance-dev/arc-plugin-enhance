export let get = [ one, two ]

async function one (req) {
  req.first = 'thing'
}

async function two (req) {
  const second = false

  return { json: { first: req.first, second } }
}
