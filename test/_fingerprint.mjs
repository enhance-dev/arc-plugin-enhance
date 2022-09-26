import test from 'tape'
import fs from 'fs'
import url from 'url'
import path from 'path'
import fingerprint from '../src/plugins/_fingerprint.js'
import tiny from 'tiny-json-http'
import sandbox from '@architect/sandbox'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mockProjectDir = path.join(__dirname,'mocks','app-with-static-assets')
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
  const bar = await tiny.get({url:'http://localhost:3333/_public/bar-YYIW2UBG.mjs'})
  t.equal(bar.body, '// test/mocks/app-with-static-assets/public/bar.mjs\n' +
        'var bar_default = "bar";\n' +
        'export {\n' +
        '  bar_default as default\n' +
        '};\n','got fingerprinted mjs')
  t.equal(bar.headers['cache-control'],'max-age=31536000','long cache')
})
  

test('sandbox shutdown', async t => {
  t.plan(1)
  const sandboxEnd = await sandbox.end()
  t.ok(sandboxEnd==='Sandbox successfully shut down','Sandbox started')
})