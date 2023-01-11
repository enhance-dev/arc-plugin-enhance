export async function get (/* req */) {
  return { json: { data: '/test/$$.mjs' } }
}
