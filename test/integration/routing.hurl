# This replicates test/dynamic-routing.mjs

GET {{host}}
HTTP/* 200

GET {{host}}/test/one
HTTP/* 200
[Asserts]
jsonpath "$.data" == "one"

GET {{host}}/test/two
HTTP/* 200
[Asserts]
xpath "/html/body/page-test-two" exists
