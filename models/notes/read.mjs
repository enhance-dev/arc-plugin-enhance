import data from '@begin/data'

export default async function read (key) {
  return data.get({ table: 'notes', key })
}
