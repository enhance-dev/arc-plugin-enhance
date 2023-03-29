# Changelog


## [5.0.3] 2023-03-29

### Update
Updates to latest Enhance SSR which adds `context` and `instanceID` support
Updates to latest Enhance styles which updates script name to `enhance-styles` from `enhance`
Updates to latest Architect sandbox

### Fixes
Fixes passing all user supplied headers

## [5.0.1] 2023-02-21

### Update
- Exports `any-catchall/index.mjs` for `fastify` plugin

### Fixes
- Fix for nested dynamic routes

```
// ... /people/13/things/4 ... pages/users/$id/things/$thingID.mjs . page-users--id-things--thingid
```

### Breaking
- Updates output of browser bundles to `/_public/browser`

---

## [4.4.1] 2023-01-18

### Update

- Patch for user-supplied rollup.config.mjs
---

## [4.4.0] 2023-01-18

### Added

- Support for user-supplied rollup.config.js

## [4.3.5] 2023-01-10

### Fixes

- Improve logging related to reading the static asset manifest

---

## [4.3.4] 2023-01-05

### Fixes

- Middleware respects a location response for early exit; h/t @clintjhill (https://github.com/enhance-dev/arc-plugin-enhance/pull/63)

---

## [4.3.3] 2022-12-22

### Added

- Support for "." in URL paths; this can mean file-based routes look hidden on some operating systems! Blame the webfinger spec. =)

---

## [4.3.0] 2022-12-14

### Added

- Adds `@enhance/arc-plugin-rollup` _officially_ exports router for using with alternate file trees


### Fixes

- Writing session to `_idx` cookie when using middleware array

---

## [4.2.0] 2022-12-08

### changed

- Updates `@enhance/arc-plugin-enhance` to latest which includes swapping `/tmp` to `.enhance` for generated output

---

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
z
