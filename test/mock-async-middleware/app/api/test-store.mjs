export let get = [one, two]

async function one (req) {
  req.stuff = [1, true, 'yas']
}

async function two (req) {
  let stuff = req.stuff
  return {
    session: { works: true },
    json: { stuff }
  }
}

