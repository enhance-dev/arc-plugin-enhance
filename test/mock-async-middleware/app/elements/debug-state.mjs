export default function debug ({ html, state }) {
  return html`<pre>${JSON.stringify(state, null, 2)}</pre>`
}
