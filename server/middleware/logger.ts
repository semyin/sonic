// server/middleware/logger.ts
import type { Context, Next } from 'hono'

export async function logger(c: Context, next: Next) {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path

  await next()

  const duration = Date.now() - start
  const status = c.res.status

  // Color code based on status
  const statusColor =
    status >= 500 ? '\x1b[31m' : // Red for 5xx
    status >= 400 ? '\x1b[33m' : // Yellow for 4xx
    status >= 300 ? '\x1b[36m' : // Cyan for 3xx
    status >= 200 ? '\x1b[32m' : // Green for 2xx
    '\x1b[0m' // Default

  const reset = '\x1b[0m'
  const gray = '\x1b[90m'
  const methodColor = '\x1b[35m' // Magenta for method

  console.log(
    `${gray}[${new Date().toISOString()}]${reset} ` +
    `${methodColor}${method.padEnd(7)}${reset} ` +
    `${statusColor}${status}${reset} ` +
    `${path} ` +
    `${gray}${duration}ms${reset}`
  )
}
