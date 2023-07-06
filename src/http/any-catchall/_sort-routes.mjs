/** helper to sort routes from least ambiguous to most */
export default function sorter (a, b) {
  // Sorting is done by assinging letters to each part of the path
  // and then using alphabetical ordering to sort on.
  // They are sorted in reverse alphabetical order so that
  // extra path parts at the end will rank higher when reversed.
  function pathPartWeight (str) {
    // assign a weight to each path parameter
    // catchall='A' < dynamic='B' < static='C' < index='D'
    if (str === '$$.mjs' || str === '$$.html') return 'A'
    if (str.startsWith('$')) return 'B'
    if (!(str === 'index.mjs' || str === 'index.html')) return 'C'
    if (str === 'index.mjs' || str === 'index.html') return 'D'
  }

  function totalWeightByPosition (str) {
    // weighted by position in the path
    // /highest/high/low/lower/.../lowest
    // return result weighted by type and position
    // * When sorted in reverse alphabetical order the result is as expected.
    // i.e. /index.mjs = 'D'
    // i.e. /test/index.mjs = 'CD'
    // i.e. /test/this.mjs = 'CC'
    // i.e. /test/$id.mjs = 'CB'
    // i.e. /test/$$.mjs = 'CA'
    if (process.platform === 'win32'){
      str = str.replace(/\\/g, '/')
    }
    return str.split('/').reduce((prev, curr) => {
      return (prev + (pathPartWeight(curr) ))
    }, '')
  }

  const aWeight = totalWeightByPosition(a)
  const bWeight = totalWeightByPosition(b)

  let output
  if (aWeight < bWeight) output = 1
  if (aWeight > bWeight) output = -1
  if (aWeight === bWeight) output = 0

  return output

}
