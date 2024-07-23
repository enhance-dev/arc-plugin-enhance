export default function FourOhFour ({ html, state }) {
  const { error } = state.attrs

  return html`
      <main>
        <h1>Custom 404</h1>
        <h2>Sorry we can't find that.</h2>
        <p>${error && error}</p>
      </main>
    `
}
