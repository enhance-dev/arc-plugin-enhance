import { styles }  from '@enhance/arc-plugin-styles'

export default function Head() {
  const appStyles = process.env.ARC_LOCAL
    ? styles.getLinkTag()
    : styles.getStyleTag()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  ${ appStyles }
  <link rel="icon" href="/_public/favicon.svg">
</head>
`
}
