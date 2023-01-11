import read from '../../../models/notes/read.mjs'
import update from '../../../models/notes/update.mjs'
import destroy from '../../../models/notes/destroy.mjs'

// post /notes/:id - update or destroy a note
export async function post (req) {
  let method = req.body._method === 'delete' ? destroy : update
  let note = { ...req.body }
  note.key = req.params.id
  let json = await method(req.body)
  let location = '/notes'
  return { json, location }
}

// get /notes/:id - read a note
export async function get (req) {
  let note = await read(req.params.id)
  return { json: { note } }
}
