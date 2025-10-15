// server/utils/response.ts
import type { Context } from 'hono'

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
 * Send success response
 */
export function success<T>(c: Context, data: T, status = 200, msg = 'Success') {
  return c.json<SuccessResponse<T>>({
    code: status,
    msg,
    data
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
