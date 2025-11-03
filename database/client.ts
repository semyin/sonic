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

// IMPORTANT: Don't create singleton in Cloudflare Workers
// Each request should get a fresh connection from the pool

export function getDb(env?: DbEnv): DrizzleDb {
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL

  console.log('DATABASE_URL:', databaseUrl);
  

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  // Create a new postgres client for each call
  // The postgres library handles internal connection pooling
  const client = postgres(databaseUrl, {
    prepare: false,        // CRITICAL: Must disable for Supabase Pooler Transaction Mode
    max: 1,                // Single connection per client
    fetch_types: false,    // Disable automatic type fetching for better performance
    idle_timeout: 20,      // Close idle connections after 20s
    connect_timeout: 30,   // Connection timeout 30s
  })

  return drizzle(client, { schema })
}

// For creating a fresh connection (useful in some edge cases)
export function createDb(databaseUrl: string): DrizzleDb {
  const client = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    fetch_types: false,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  return drizzle(client, { schema })
}

// Export a function to get db, not a singleton instance
export const getDbInstance = () => getDb()
