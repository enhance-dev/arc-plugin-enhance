export default function FourOFour ({ html, state }) {
  return html`
<section>
  <h1>Oops, something went wrong</h1>
  <p>${state.attrs.error || 'page not found'}</p>
</section>
`
}
