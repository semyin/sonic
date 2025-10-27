# Repository Guidelines

## Project Structure & Module Organization
- Vike routes live in `pages/`; each folder holds the page-specific `+Page.tsx` plus optional config files.
- Shared UI sits in `components/`, layouts in `layouts/`, and cross-cutting utilities in `lib/`.
- `server/index.ts` boots the Hono app, mounts API routers from `server/api`, then hands off to Vike.
- Persistence logic stays in `database/` (Drizzle schema, typed services, serializers, migrations).
- Static assets belong in `assets/`, and maintenance scripts live under `scripts/` (e.g., `check-db-stats.ts`).

## Build, Test, and Development Commands
- `npm run dev`: start the Vike + Hono dev server on http://localhost:3000.
- `npm run build`: compile the Cloudflare Worker bundle ready for deployment.
- `npm run pages-dev`: build then run `wrangler pages dev` for a local Pages preview.
- `npm run pages-deploy`: build and deploy to Cloudflare Pages.
- Database helpers: `npm run db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:stats` for migration upkeep.

## Coding Style & Naming Conventions
- TypeScript + React with two-space indentation; keep modules ES-first and prefer single quotes.
- Use PascalCase for components/hooks, camelCase for utilities, and SCREAMING_SNAKE_CASE for environment variables.
- Keep Vike page directories plural; pair them with a `+page.tsx` (and optional `+layout.tsx`) for clarity.
- Re-export shared helpers from folder `index.ts` files to keep imports tidy.

## Testing Guidelines
- No automated runner is configured yet; run `npm run dev` plus `npm run pages-dev` for smoke coverage before PRs.
- Confirm database drift with `npm run db:stats` and validate serializer changes with live API calls.
- New automated tests should live beside the source as `*.test.ts`, using descriptive 'should...' names.
- Document manual test steps in the PR so reviewers can reproduce them quickly.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`) as seen in `git log`.
- PRs must summarize the change, link issues or tickets, note database impacts, and attach UI/API evidence when relevant.
- Ensure build and database scripts run cleanly before requesting review; call out any known limitations.

## Security & Configuration Tips
- Copy `.env.example` when onboarding and keep secrets in `.env` files or Wrangler bindings; never check them into git.
- After touching `database/schema.ts`, regen migrations via Drizzle, commit the SQL, and verify `drizzle.config.ts` paths.
