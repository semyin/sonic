// database/client.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { config } from 'dotenv'
import type { DrizzleDb } from './types'

// Load environment variables
config()

export interface DbEnv {
  DATABASE_URL: string
}

let dbInstance: DrizzleDb | null = null

export function getDb(env?: DbEnv): DrizzleDb {
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  // Reuse connection in development for better performance
  if (!dbInstance) {
    const client = postgres(databaseUrl)
    dbInstance = drizzle(client, { schema })
  }

  return dbInstance
}

// For creating a fresh connection (useful in some edge cases)
export function createDb(databaseUrl: string): DrizzleDb {
  const client = postgres(databaseUrl)
  return drizzle(client, { schema })
}

// Export a default database instance for API routes
export const db: DrizzleDb = getDb()
