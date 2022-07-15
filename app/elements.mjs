import Index from './pages/index.mjs'
import About from './pages/about.mjs'
import Contact from './pages/contact.mjs'
import Notes from './pages/notes/index.mjs'
import Note from './pages/notes/$id.mjs'
import FourOFour from './pages/404.mjs'
import FiveHundred from './pages/500.mjs'
import Header from './elements/header.mjs'
import Footer from './elements/footer.mjs'

const elements = {
  'page-index': Index,
  'page-about': About,
  'page-contact': Contact,
  'page-notes': Notes,
  'page-note': Note,
  'page-404': FourOFour,
  'page-500': FiveHundred,
  'el-header': Header,
  'el-footer': Footer,
}

export default elements
