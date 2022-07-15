export default function FiveHundred ({ html, state }) {
  const { attrs } = state
  const { error } = attrs
  const message = error?.message || 'System failure.'
  return html`
<el-header></el-header>
<section>
  <h1>Oops, something went wrong</h1>
  <p>${message}</p>
</section>
<el-footer></el-footer>
`
}
