import test from 'tape'
import fs from 'fs'
import url from 'url'
import path from 'path'
import fingerprint from '../src/plugins/_fingerprint.js'
import tiny from 'tiny-json-http'
import sandbox from '@architect/sandbox'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const mockProjectDir = path.join(__dirname, 'mocks', 'mock-app')
const mockPublicDir = path.join(mockProjectDir, 'public')
const mockBuildDir = path.join(mockPublicDir, '_public')
try {
fs.rmSync(mockBuildDir, { recursive: true }) // cleanup previous build
} catch(e){ console.log('already clean')}


test('fingerprinting', async t => {
  t.plan(1)
  fingerprint(mockPublicDir)
  t.pass('fingerprinted')
})

test('fingerprinted files', async t => {
  t.plan(1)
  const sandboxStart = await sandbox.start({ cwd: mockProjectDir })
  t.ok(sandboxStart === 'Sandbox successfully started', 'Sandbox started')
})
  
test('get javascript asset not fingerprinted', async t => {
  t.plan(2)
  const bar = await tiny.get({url:'http://localhost:3333/_public/bar.mjs'})
  t.equal(bar.body , "export default 'bar'", 'got mjs asset w/o fingerprinting')
  t.equal(bar.headers['cache-control'],'max-age=0, must-revalidate','short cache')
})
  
test('get javascript asset fingerprinted', async t => {
  t.plan(2)
  const replacementFile = fs.readFileSync(path.join(mockBuildDir,'replacement-manifest.json'))
  const replacementManifest = JSON.parse(replacementFile)
  const bar = await tiny.get({url:`http://localhost:3333/_public/${replacementManifest['bar.mjs']}`})
  t.equal(bar.body, '// test/mocks/mock-app/public/bar.mjs\n' +
        'var bar_default = "bar";\n' +
        'export {\n' +
        '  bar_default as default\n' +
        '};\n','got fingerprinted mjs')
  t.equal(bar.headers['cache-control'],'max-age=31536000','long cache')
})

test('Response references transformed', async t => {
  t.plan(1)
  const replacementFile = fs.readFileSync(path.join(mockBuildDir,'replacement-manifest.json'))
  const replacementManifest = JSON.parse(replacementFile)
  const page = await tiny.get({ url: 'http://localhost:3333/test' })
  const expected = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <link rel="stylesheet" href="/_static/styles.css">
  <link rel="icon" href="/_static/favicon.svg">
</head>
<body><img src="/_public/${replacementManifest['favicon.svg']}">
<script type="module">
	import bar from '/_public/${replacementManifest['bar.mjs']}'
</script>
<script type="module">
	const foo = await import (\`\${
'/_public/' + 'foo.mjs'
}\`)
</script>
</body></html>`

  t.equal(page.body, expected, 'page assets fingerprinted')
})
  

test('sandbox shutdown', async t => {
  t.plan(1)
  const sandboxEnd = await sandbox.end()
  t.ok(sandboxEnd==='Sandbox successfully shut down','Sandbox started')
})