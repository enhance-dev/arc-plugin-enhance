export default function Note ({ html, state }) {
  return html`
<el-header></el-header>
<section>
  <h1>Note page</h1>
  <pre>${JSON.stringify(state, null, 2)}</pre>
</section>
<el-footer></el-footer>
  `
}
