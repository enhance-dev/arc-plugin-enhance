export default function FourOFour ({ html, state }) {
  const { attrs } = state
  const { error } = attrs
  const message = error?.message || 'Requested page was not found.'
  return html`
<el-header></el-header>
<section>
  <h1>Oops, something went wrong</h1>
  <p>${message}</p>
</section>
<el-footer></el-footer>
`
}
