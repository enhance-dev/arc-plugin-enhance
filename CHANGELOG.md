# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Unreleased

---

[4.3.4] Jan 5th 2023

### Fixes

Middleware respects a location response for early exit; h/t @clintjhill (https://github.com/enhance-dev/arc-plugin-enhance/pull/63)

[4.3.3] Dec 22nd 2022

### Added

Support for "." in URL paths; this can mean file based routes look hidden on some operating systems! Blame the webfinger spec. =)

[4.3.0] Dec 14th 2022

### Added

Adds `@enhance/arc-plugin-rollup` _officially_
exports router for using with alternate file trees

### Fixes

Writing session to `_idx` cookie when using middleware array

[4.2.0]
### changed

Updates `@enhance/arc-plugin-enhance` to latest which includes swapping `/tmp` to `.enhance` for generated output

