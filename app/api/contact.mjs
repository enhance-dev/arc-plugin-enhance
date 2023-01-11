import data from '@begin/data'

export async function post (req) {
  let contact = await data.set({
    table: 'contacts',
    message: req.body.message,
    ts: Date.now()
  })
  console.log('saved', contact)
  return {
    location: '/contact?success=true'
  }
}
