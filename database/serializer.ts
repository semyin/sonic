// database/serializer.ts
import { format } from 'date-fns'

/**
 * Format a single date value to 'yyyy-MM-dd HH:mm:ss'
 */
function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return format(dateObj, 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return null
  }
}

/**
 * Serialize a single object by formatting timestamp fields
 */
export function serialize<T extends Record<string, any>>(obj: T | null): T | null {
  if (!obj) return null

  const result: any = { ...obj }

  // Format timestamp fields
  if ('createdAt' in result && result.createdAt) {
    result.createdAt = formatDate(result.createdAt)
  }

  if ('updatedAt' in result && result.updatedAt) {
    result.updatedAt = formatDate(result.updatedAt)
  }

  // Handle nested objects
  for (const key in result) {
    const value = result[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check if it's a Date object
      if (Object.prototype.toString.call(value) !== '[object Date]') {
        result[key] = serialize(value)
      }
    }
  }

  return result as T
}

/**
 * Serialize an array of objects
 */
export function serializeArray<T extends Record<string, any>>(arr: T[]): T[] {
  return arr.map(item => serialize(item)!)
}
