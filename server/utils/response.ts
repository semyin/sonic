// server/utils/response.ts
import type { Context } from 'hono'
import { format } from 'date-fns'

export interface SuccessResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ErrorResponse {
  code: number
  msg: string
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Format timestamp to readable format: YYYY-MM-DD HH:mm:ss
 */
function formatTimestamp(value: any): string | any {
  if (!value) return value

  // If it's a Date object
  if (value instanceof Date) {
    return format(value, 'yyyy-MM-dd HH:mm:ss')
  }

  // If it's a string that looks like an ISO timestamp
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    try {
      return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
    } catch {
      return value
    }
  }

  return value
}

/**
 * Format timestamps in an object recursively
 */
function formatTimestamps(data: any): any {
  if (data === null || data === undefined) return data

  if (Array.isArray(data)) {
    return data.map(formatTimestamps)
  }

  if (typeof data === 'object') {
    const formatted: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Format timestamp fields
      if (key === 'createdAt' || key === 'updatedAt') {
        formatted[key] = formatTimestamp(value)
      } else if (typeof value === 'object' && value !== null) {
        formatted[key] = formatTimestamps(value)
      } else {
        formatted[key] = value
      }
    }
    return formatted
  }

  return data
}

/**
 * Send success response
 */
export function success<T>(c: Context, data: T, status = 200, msg = 'Success') {
  const formattedData = formatTimestamps(data)
  return c.json<SuccessResponse<T>>({
    code: status,
    msg,
    data: formattedData
  }, status as any)
}

/**
 * Send error response
 */
export function error(c: Context, msg: string, status = 500) {
  return c.json<ErrorResponse>({
    code: status,
    msg
  }, status as any)
}

/**
 * Handle errors from try-catch
 */
export function handleError(c: Context, err: unknown, status = 500) {
  const msg = err instanceof Error ? err.message : 'Unknown error'
  return error(c, msg, status)
}
