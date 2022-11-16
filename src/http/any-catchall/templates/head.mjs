import getStyles from '@enhance/arc-plugin-styles/get-styles'

export default function Head () {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  ${getStyles().link}
  <link rel="icon" href="/_public/favicon.svg">
</head>
`
}
