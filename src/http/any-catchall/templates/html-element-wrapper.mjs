function inject (str, obj) {
  return str.replace(/\${(.*?)}/g, (x, g) => getPath(obj, g))
}

function getPath (obj, path) {
  try {
    return new Function('_', 'return _.' + path)(obj)
  }
  catch (e) {
    return obj[path]
  }
}

export default function HTMLElementWrapper ({ template }) {
  return function Element ({ html, state }) {
    let innerTemplate = inject(template, state)
    return html`${innerTemplate}`
  }
}
