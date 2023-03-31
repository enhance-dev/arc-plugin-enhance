export default function ({ html, state }) {
  return html`<h1>Hello World</h1><pre>${JSON.stringify(state.store)}</pre>`
}
