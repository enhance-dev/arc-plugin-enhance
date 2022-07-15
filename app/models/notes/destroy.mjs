import data from '@begin/data'

export default async function destroy (params) {
  return data.destroy({ table: 'notes', ...params })
}
