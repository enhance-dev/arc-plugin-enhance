export default function catchall ({ html, state }) {
  return html`hi from catchall <pre>${JSON.stringify(state, null, 2)}</pre>`
}
