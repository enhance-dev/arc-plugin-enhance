export default function About ({ html, state }) {
  return html`
<el-header></el-header>
<section>
  <!-- <h1>About page</h1> -->
  <pre>${JSON.stringify(state, null, 2)}</pre>
  <p>backup-markup</p>
</section>
<el-footer></el-footer>
  `
}
