export default function MyHeader({ html, state }) {
  const { store = {} } = state
  const { title = 'huh?' } = store
  return html`
<header>
  <h1>${title}</h1>
</header>
`
}
