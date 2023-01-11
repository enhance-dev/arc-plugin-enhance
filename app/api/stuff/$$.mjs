// get /stuff/*
export async function get (req) {
  return { json: { req } }
}
