export default function FiveHundred ({ html, state }) {
  return html`
<style>
  .max-w {
    max-width: 30rem;
  }
  .min-w {
    min-width: 18rem;
  }
</style>
<section class="p0 p2-lg">
  <h1 class="text1 mb2">Oops, something went wrong</h1>
  <div class="overflow-x-auto">
    <pre><code>${state.attrs.error || 'system failure please try again'}</code></pre>
  </div>
</section>
`
}
