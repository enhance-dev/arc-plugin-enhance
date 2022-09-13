export default function Header ({ html }) {
  return html`
<header>
  <h1>Header</h1>
  <nav>
    <a href=/>home</a>
    <a href=/about>about</a>
    <a href=/fun>fun</a>
    <a href=/contact>contact</a>
    <a href=/notes>notes</a>
    <a href=/stuff/foo>catch all</a>
  </nav>
</header>
`
}
