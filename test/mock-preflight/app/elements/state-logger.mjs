export default function StateLogger({ html, state }) {
  const { store={} } = state
  return html`
    <pre>
      ${JSON.stringify(store, null, 2)}
    </pre>
  `
}
