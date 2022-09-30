export default function clean ({ pathTmpl, base, fileNameRegEx }) {
    return pathTmpl.replace(base, '')
    .replace(fileNameRegEx, '')
    .replace(/(\/?)\$\$\/?$/, '$1(.*)') //$$.mjs is catchall
    .replace(/\/\$(\w+)/g, "/:$1")
    .replace(/\/+$/, '')
}
