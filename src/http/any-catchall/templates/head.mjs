/* eslint-disable */
export default function Head (state) {
  const { req, status, error, store } = state
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <link rel="stylesheet" href="/_public/styles.css">
  <link rel="icon" href="/_public/favicon.svg">
</head>
`
}
