# `@enhance-dev/arc-plugin-enhance`
This Architect plugin customizes a default [Architect](https://arc.codes) project to add file based routing and server rendered Custom Elements.

## Quick start
`npx "@enhance/create@latest" ./myproject -y`

⚠️ This repo is **not** meant to be cloned unless you are filing an issue or adding functionality. It is meant to be used by the generators linked above instead.

## Project structure

```
app
├── api ............... data routes
│   └── index.mjs
├── browser ........... browser JavaScript
│   └── index.mjs
├── elements .......... Custom Element pure functions
│   └── my-header.mjs
└── pages ............. file-based routing
    └── index.html

```
[Read the documentation here →](https://enhance.dev)
