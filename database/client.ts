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

let clientInstance: postgres.Sql | null = null

export function getDb(env?: DbEnv): DrizzleDb {
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  // For Cloudflare Workers with Supabase Pooler: use transaction mode settings
  if (!clientInstance) {
    clientInstance = postgres(databaseUrl, {
      prepare: false,        // CRITICAL: Disable prepared statements for pooler transaction mode
      max: 1,                // Single connection for edge runtime
      idle_timeout: 20,      // Close idle connections after 20s
      connect_timeout: 10,   // Connection timeout
      max_lifetime: 60 * 30, // Max connection lifetime: 30 minutes
    })
  }

  return drizzle(clientInstance, { schema })
}

// For creating a fresh connection (useful in some edge cases)
export function createDb(databaseUrl: string): DrizzleDb {
  const client = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
  })
  return drizzle(client, { schema })
}

// Export a default database instance for API routes
export const db: DrizzleDb = getDb()
