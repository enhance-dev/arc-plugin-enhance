export default function clean ({ pathTmpl, base, fileNameRegEx }) {
  if (process.platform === 'win32') {
    base = base.replace(/\\/g, '/')
    pathTmpl = pathTmpl.replace(/\\/g, '/')
  }

  return pathTmpl.replace(base, '')
    .replace(fileNameRegEx, '')
    .replace(/(\/?)\$\$\/?$/, '$1(.*)') // $$.mjs is catchall
    .replace(/\/\$(\w+)/g, '/:$1')
    .replace(/\/+$/, '')
    .replace(/\\/g, '/')
}
