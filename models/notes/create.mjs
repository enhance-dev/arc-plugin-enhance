import data from '@begin/data'
import fmt from './fmt.mjs'

export default async function create (params) {
  let raw = await data.set({ table: 'notes', ...params })
  return fmt(raw)
}
