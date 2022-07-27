import About from './pages/about.mjs'
import Contact from './pages/contact.mjs'
import Notes from './pages/notes/index.mjs'
import Note from './pages/notes/$id.mjs'
import NoteArg from './pages/notes/$id/arg.mjs'
import Header from './elements/header.mjs'
import Footer from './elements/footer.mjs'

const elements = {
  'page-about': About,
  'page-contact': Contact,
  'page-notes': Notes,
  'page-note-arg': NoteArg,
  'page-note': Note,
  'el-header': Header,
  'el-footer': Footer,
}

export default elements
