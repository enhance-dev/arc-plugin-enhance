export default function Contact ({ html, /* state */ }) {
  return html`
<el-header></el-header>
<form method=post action=/contact>
  <textarea name=message></textarea>
  <button>Send message</button>
</form>
<el-footer></el-footer>
  `
}
