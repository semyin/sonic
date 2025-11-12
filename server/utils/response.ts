import type { Context } from 'hono'
import { format } from 'date-fns'

export interface SuccessResponse<T = any> {
  code: number
  msg: string
  data: T
  count?: number
}

export interface ErrorResponse {
  code: number
  msg: string
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Send success response
 */
export function success<T>(c: Context, data: T, status = 200, msg = 'Success', count?: number) {
  const response: SuccessResponse<T> = {
    code: status,
    msg,
    data
  }
  if (count !== undefined) response.count = count
  return c.json<SuccessResponse<T>>(response, status as any)
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

/**
 * Unified result handler
 */
export const result = {
  ok<T>(c: Context, data: T, msg = 'Success', count?: number | null) {
    const response: SuccessResponse<T> = {
      code: 200,
      msg,
      data
    }
    if (count !== undefined && count !== null) response.count = count
    return c.json<SuccessResponse<T>>(response, 200)
  },
  from<T>(
    c: Context,
    response: { data: T | null; error: any; count?: number | null; statusText?: string },
    options?: string[] | ((data: NonNullable<T>) => any)
  ) {
    if (response.error) {
      return result.error(c, response.error.message || 'Database error')
    }

    let data: any = response.data

    // 格式化时间字段
    const timeFields = Array.isArray(options) ? options : ['created_at', 'updated_at']

    const formatTime = (obj: any): any => {
      if (!obj) return obj
      if (Array.isArray(obj)) return obj.map(formatTime)
      if (typeof obj === 'object') {
        const result = { ...obj }
        for (const key of timeFields) {
          if (result[key]) {
            try {
              result[key] = format(new Date(result[key]), 'yyyy-MM-dd HH:mm:ss')
            } catch {}
          }
        }
        return result
      }
      return obj
    }

    // 格式化时间
    data = formatTime(data)

    // 执行自定义转换函数
    if (typeof options === 'function') {
      data = data ? options(data) : data
    }

    return result.ok(c, data, response.statusText || 'Success', response.count)
  },
  error(c: Context, msg: string, status = 500) {
    return c.json<ErrorResponse>({
      code: status,
      msg
    }, status as any)
  }
}
