import data from '@begin/data'

export default async function list () {
  return data.get({ table: 'notes' })
}
