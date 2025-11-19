# Repository Guidelines

## Project Structure & Module Organization
Vike routes live in `pages/`, each plural folder containing a `+Page.tsx` (and optional layout/config). Share hooks and UI primitives from `components/` and wire reusable layouts through `layouts/`. Cross-cutting helpers should live in `lib/` with clean `index.ts` re-exports. The Cloudflare Worker boot sequence starts at `server/index.ts`, which mounts `server/api/*` routers before handing off to Vike's handler. Persistence code, including Drizzle schema, services, serializers, and migrations, resides under `database/`, while static media and icons belong in `assets/`. Maintenance scripts such as `scripts/check-db-stats.ts` sit under `scripts/`, and assets produced by builds land in `dist/`.

## Build, Test, and Development Commands
`npm run dev` launches the Vike + Hono dev server on http://localhost:3000. `npm run build` compiles the worker bundle for deployment. `npm run pages-dev` runs the build and then `wrangler pages dev` for a Pages preview, and `npm run pages-deploy` pushes the built assets to Cloudflare Pages. Database upkeep uses `npm run db:generate`, `db:migrate`, `db:push`, `db:studio`, and `db:stats`; run `db:stats` before touching migrations to confirm drift.

## Coding Style & Naming Conventions
Code is TypeScript + React with two-space indentation and single quotes. Components, hooks, and layouts use PascalCase; utilities use camelCase; environment variables are SCREAMING_SNAKE_CASE. Keep Vike folders plural and co-locate data loaders or config with their page. Prefer ES module syntax, keep imports relative to `components/`, `lib/`, etc., and ensure shared helpers re-export via `index.ts` files.

## Testing Guidelines
There is no automated runner yet. Smoke test with `npm run dev` and `npm run pages-dev` before pushing. New tests live beside the source as `*.test.ts`, named with "should..." descriptions and using whichever lightweight harness the module already uses. Document any manual verification steps in the PR so reviewers can replay them.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`) as shown in `git log`. PRs must summarize the change, link relevant issues or tickets, state database or worker impacts, and attach UI or API evidence (screenshots, curl output, etc.) when appropriate. Confirm build and database scripts run cleanly, call out limitations, and note any required environment or Wrangler binding updates.

## Security & Configuration Tips
Never commit real secrets; copy `.env.example`, populate `.env`, and configure Wrangler bindings in `wrangler.toml`. After editing `database/schema.ts`, regenerate migrations via Drizzle, commit the SQL, and double-check `drizzle.config.ts` paths so deploys stay deterministic.