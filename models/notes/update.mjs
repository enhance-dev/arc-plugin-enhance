import data from '@begin/data'

export default async function update (params) {
  if (!params.key) throw Error('missing_key')
  return data.set({ table: 'notes', ...params })
}
