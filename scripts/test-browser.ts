import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout } from 'node:timers/promises'

const server = spawn('pnpm', ['exec', 'wrangler', 'pages', 'dev', 'dist', '--port', '8788'], {
  detached: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: '.wrangler/logs' },
})
let log = ''
server.stdout.on('data', (chunk) => { log += chunk })
server.stderr.on('data', (chunk) => { log += chunk })
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(log)
    try { ready = (await fetch('http://127.0.0.1:8788/')).ok } catch { /* Waiting for Pages. */ }
    if (ready) break
    await setTimeout(500)
  }
  if (!ready) throw new Error(`Pages preview did not start:\n${log}`)
  const tests = spawn(process.execPath, ['--test', 'src/render-home.browser.test.ts'], { stdio: 'inherit' })
  const [code] = await once(tests, 'exit')
  process.exitCode = Number(code ?? 1)
} finally {
  if (server.pid && server.exitCode === null) process.kill(-server.pid, 'SIGTERM')
}
