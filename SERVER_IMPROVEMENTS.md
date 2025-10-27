# Backend Improvement Log

## High Priority
- Add request validation via `@hono/validator` + `drizzle-zod` before reaching the service layer to avoid passing raw `req.json()` payloads downstream (server/api/article.ts).
- Wrap article and tag mutations in a single drizzle transaction to prevent partial writes when tag insertion fails (database/services/article.ts).
- Adjust `getDb()` for Cloudflare Workers by reusing clients in Node and switching to bindings/HTTP driver at the edge to avoid connection leaks (database/client.ts).
- Introduce authentication and role-based guards so create/update/delete routes live behind protected groups (server/api/index.ts).
- Trim the detailed logger and gate body cloning/logging behind an environment flag to cut edge runtime overhead (server/middleware/logger-detailed.ts).
- Standardize error responses with domain codes and a requestId instead of relaying raw exception messages (server/utils/response.ts).

## Mid-Term Improvements
- Leverage drizzle relations or `db.query` helpers to reduce duplicated select definitions and ease schema refactors (database/services/article.ts).
- Add a cache layer (KV/Redis/etag) for popular listing endpoints to lower database read pressure.
- Make like/view counters idempotent or batch-updated to avoid lock contention under load.
- Return pagination metadata (total/pageSize) alongside list payloads so clients can paginate accurately.
- Normalize log strings to ASCII/English to prevent console encoding issues across environments (server/middleware/logger-detailed.ts).

## Engineering & DX
- Introduce Vitest + MSW coverage for service and routing flows to restore automated safety nets.
- Harden environment validation and provide a Worker-compatible database driver in maintenance scripts (scripts/check-db-stats.ts).
- Add eslint + prettier (or biome) with husky/lint-staged to enforce consistent formatting.
- Publish OpenAPI or a typed client package so the upcoming frontend can share API definitions.
