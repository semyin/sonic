# Repository Guidelines

## Project Structure & Module Organization
Routes live in `pages/` using Vike's file conventions (`+Page.tsx`, `+Layout.tsx`, optional `+Head.tsx`). Shared UI stays in `components/`, layout wrappers in `layouts/`, hooks in `hooks/`, and helpers in `utils/`. Worker endpoints and middleware live in `server/`, with Supabase client logic centralized in `supabase/index.ts`. Static media belong to `assets/`; `dist/` is generated and should not be edited.

## Build, Test, and Development Commands
`npm run dev` starts the hot-reloading Vike server at `localhost:5173`. `npm run build` emits the React bundle plus worker output into `dist/` and `dist/cloudflare`. `npm run pages-dev` builds then runs `wrangler pages dev` so you can exercise the Cloudflare runtime and KV locally. `npm run pages-deploy` deploys through Wrangler - use only when you intend to publish. Copy `.env.example` to `.env` before invoking any script.

## Coding Style & Naming Conventions
Write strict TypeScript and React 19 function components that prefer Chakra UI props; fall back to scoped SCSS modules (e.g., `pages/index/Layout.module.scss`) or Tailwind utilities merged with `tailwind-merge`. Components/files use PascalCase, hooks/utilities camelCase, and routed files keep the `+` prefix. Indent with two spaces, keep modules cohesive, and import via the configured `@/` or `#root/` aliases instead of long relative paths.

## Testing Guidelines
There is no bundled runner yet, so each PR must include a manual test plan describing the touched routes, worker handlers, and Supabase changes. If you add automated coverage, colocate `*.test.ts` files with the implementation (for example `server/api/posts/index.test.ts`) and execute them with Vitest or `tsx` before committing. Always run both `npm run dev` and `npm run pages-dev` to confirm UI code and worker code agree.

## Commit & Pull Request Guidelines
Follow the conventional style already in history (`feat(navbar): ...`, `fix(auth): ...`), keep commits focused, and ensure `npm run build` succeeds before pushing. PRs should summarize the problem, solution, and manual verification, link any issues, note new environment variables or Wrangler bindings, and attach screenshots or GIFs for UI work. Request review for server or infra changes early so deployments stay coordinated.

## Environment & Deployment Notes
Never commit `.env`; supply at least `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_KEY` locally. Wrangler configuration lives in `wrangler.toml`; when you change KV bindings or `pages_build_output_dir`, update the file and mention it in your PR. Supabase helpers should read configuration from `supabase/index.ts` so secrets remain centralized.
