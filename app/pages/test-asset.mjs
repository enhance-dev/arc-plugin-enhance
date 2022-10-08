import arc from '@architect/functions'
export default function assets({ html }) {
  return html`<img src="${arc.static('science.png')}" width="50px" height="50px">
<div>This one uses old school "_static"</div>
<img src="/_public/science.png" width="50px" height="50px">
<div>This one uses "_public"</div>
<img src="/science.png" width="50px" height="50px">
<div>This one is root relative</div>`
}