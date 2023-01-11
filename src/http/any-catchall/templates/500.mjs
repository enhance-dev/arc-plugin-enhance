export default function FiveHundred ({ html, state }) {
  return html`
<section>
  <h1>Oops, something went wrong</h1>
  <p>${state.attrs.error || 'system failure pleases try again'}</p>
</section>
`
}
