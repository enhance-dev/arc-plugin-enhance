export default function ({ html, state }){
  const data = state.store.data
  return html`${data ? data : ''}`
}
