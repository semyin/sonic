// server/utils/response.ts
import type { Context } from 'hono'

export interface SuccessResponse<T = any> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  error: string
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Format timestamps in an object to ISO string without milliseconds
 */
function formatTimestamps(data: any): any {
  if (data === null || data === undefined) return data

  if (data instanceof Date) {
    return data.toISOString().replace(/\.\d{3}Z$/, 'Z')
  }

  if (Array.isArray(data)) {
    return data.map(formatTimestamps)
  }

  if (typeof data === 'object') {
    const formatted: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Format common timestamp field names
      if ((key === 'createdAt' || key === 'updatedAt') && value instanceof Date) {
        formatted[key] = value.toISOString().replace(/\.\d{3}Z$/, 'Z')
      } else if (typeof value === 'object') {
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
export function success<T>(c: Context, data: T, status = 200) {
  const formattedData = formatTimestamps(data)
  return c.json<SuccessResponse<T>>({
    success: true,
    data: formattedData
  }, status as any)
}

/**
 * Send error response
 */
export function error(c: Context, message: string, status = 500) {
  return c.json<ErrorResponse>({
    success: false,
    error: message
  }, status as any)
}

/**
 * Handle errors from try-catch
 */
export function handleError(c: Context, err: unknown, status: number = 500) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  return error(c, message, status)
}
