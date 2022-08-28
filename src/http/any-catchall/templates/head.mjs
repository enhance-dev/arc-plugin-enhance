/* eslint-disable */
import arc from '@architect/functions'

export default function Head (req, status, error) {
  return `
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <link rel="stylesheet" href="${ arc.static('styles.css') }">
  <link rel="icon" href="${ arc.static('favicon.svg') }">
</head>
`
}
