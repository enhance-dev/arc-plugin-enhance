export default function Notes ({ html, state }) {
  let links = state.store.notes?.map(n => `<li><a href=/notes/${n.key}>${n.key}</a>`).join('')
  return html`
<el-header></el-header>
<section>
  <h1>Notes page</h1>
  <form method=post action=/notes>
    <textarea name=text></textarea>
    <button>save note</button>
  </form>
  <ul>${links}</ul>
  <pre>${JSON.stringify(state, null, 2)}</pre>
</section>
<el-footer></el-footer>
  `
}
