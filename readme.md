# `@enhance-dev/arc-plugin-enhance`

adds file based routing to arc.codes with enhance.dev server rendered custom elements

## project structure

```
public/ ............... static assets
app/
├── api/ .............. api routes
├── elements/ ......... custom elements named-like-this
└── pages/ ............ html or custom elements that are routes (eg. about.html renders /about)
    ├── about.mjs
    ├── index.html
    └── notes/
        ├── $id.mjs ... url parameters are supported
        └── index.mjs
```

### decisions

file based routing using leading `$` for dynamic parameters reasoning 

- `$` is safe on windows and linux UNLESS its trailing in which case thats a hidden file in windows
- `:` is illegal in windows file paths
- `*` will expand in various system shells creating ambiguity 
- `.` is meaningful in system shells (current dir) and completions with `..` and/or `...` creates ambiguity 
