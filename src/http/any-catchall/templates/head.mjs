import arc from '@architect/functions'

export default function Head ({ title='' }) {
  return `
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title || ''}</title>
  <link rel="stylesheet" href="${ arc.static('styles.css') }">
</head>
`
}
