export default function sorter (a, b) {

  // a is less than b (more ambiguous)
  if (a.includes('$') && b.includes('$') === false) {
    return 1
  }
  
  // a is greater than b (less ambiguous)
  if (a.includes('$')  === false && b.includes('$')) {
    return -1
  }
  
  // a and b both have $ (so who is longer; because they are less ambiguous)
  if (a.includes('$') && b.includes('$')) {
    return a.length > b.length? -1 : 1
  }
  
  // neither has $
  
  // always ensure index.html wins
  let left = a.split('/').pop()
  if (left === 'index.html' || left === 'index.mjs') return -1

  let right = b.split('/').pop()
  if (right === 'index.html' || right === 'index.mjs') return 1
  
  // fallback to str compare
  return a > b? 1 : -1
}
