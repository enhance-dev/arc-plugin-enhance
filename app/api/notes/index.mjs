import create from '../../../models/notes/create.mjs'
import list from '../../../models/notes/list.mjs'

// get /notes - list notes
export async function get () {
  let notes = await list()
  return {
    json: { notes }
  }
}

// post /notes - create a note
export async function post (req) {
  let json = await create(req.body)
  let location = '/notes'
  return { json, location }
}
