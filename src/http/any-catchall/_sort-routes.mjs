/** helper to sort routes from least ambiguous to most */
export default function sorter(a, b) {
  function pathPartWeight(str) {
    // assign a weight to each path parameter
    // catchall=1 < dynamic=2 < static=3 < index=4 
    if (str === 'catchall.mjs'||str==='catchall.html') return 1 
    if (str.startsWith('$')) return 2 
    if (!(str==="index.mjs"||str==="index.html")) return 3
    if (str==="index.mjs"||str==="index.html") return 4
  }

  function totalWeightByPosition(str) {
    // weighted by position in the path
    // /highest/high/low/lower/.../lowest
    // weigh/1, weight/10, weight/100, weight/1000
    // return result weighted by type and position
    // i.e. /index.mjs = 4
    // i.e. /test/index.mjs = 3.4
    // i.e. /test/this.mjs = 3.3
    // i.e. /test/$id.mjs = 3.2
    // i.e. /test/catchall.mjs = 3.1
    return str.split('/').reduce((prev, curr, i) => {
      return (prev + (pathPartWeight(curr) / Math.pow(10, i)))
    }, 0)
  }


  return totalWeightByPosition(a) < totalWeightByPosition(b) ?1 : -1

}
