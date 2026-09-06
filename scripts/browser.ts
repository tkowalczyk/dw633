import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)

// Browser lifecycle, navigation and interaction use the installed agent-browser.
export class Browser {
  session = `dw633-${process.pid}-${crypto.randomUUID().slice(0, 8)}`

  async command(...args: string[]): Promise<Record<string, unknown>> {
    const { stdout } = await exec('agent-browser', ['--session', this.session, '--json', ...args], {
      timeout: 45_000, maxBuffer: 2 * 1024 * 1024,
    })
    const response = JSON.parse(stdout)
    if (!response.success) throw new Error(response.error)
    return response.data
  }

  async evaluate<T>(source: string): Promise<T> {
    const data = await this.command('eval', '-b', Buffer.from(source).toString('base64'))
    return data.result as T
  }

  // CDP only supplies test instrumentation absent from the CLI: disabled JS,
  // and performance throttling. It attaches to this session only.
  async instrument() {
    const { cdpUrl } = await this.command('get', 'cdp-url')
    const socket = new WebSocket(String(cdpUrl))
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), { once: true })
      socket.addEventListener('error', () => reject(new Error('CDP connection failed')), { once: true })
    })
    let nextId = 0
    const pending = new Map<number, { resolve: (value: Record<string, unknown>) => void, reject: (error: Error) => void }>()
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      const request = pending.get(message.id)
      if (request) {
        pending.delete(message.id)
        if (message.error) request.reject(new Error(message.error.message))
        else request.resolve(message.result)
      }
    })
    const send = (method: string, params = {}, sessionId?: string) => new Promise<Record<string, unknown>>((resolve, reject) => {
      const id = ++nextId
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 15_000)
      pending.set(id, {
        resolve: (value) => { clearTimeout(timer); resolve(value) },
        reject: (error) => { clearTimeout(timer); reject(error) },
      })
      socket.send(JSON.stringify({ id, method, params, sessionId }))
    })
    const { tabs } = await this.command('tab', 'list')
    const page = (tabs as { active: boolean, targetId: string }[]).find((tab) => tab.active)
    if (!page) throw new Error('No active page in agent-browser session')
    const { sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true })
    return {
      send: (method: string, params = {}) => send(method, params, String(sessionId)),
      close: () => socket.close(),
    }
  }
}
