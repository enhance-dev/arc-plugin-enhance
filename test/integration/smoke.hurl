# Hurl can do all kinds of things
# https://hurl.dev/docs/samples.html

GET http://localhost:3333

HTTP/* 200
[Asserts]
duration < 1000 # always sub-second
xpath "normalize-space(//head/title)" == "Enhance"
