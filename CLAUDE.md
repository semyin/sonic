# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a blog application built with Vike + React, configured for deployment to Cloudflare Pages. The stack includes:
- **Vike** (v0.4.239): Full-stack React framework with SSR support
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Hono** server for Cloudflare Workers/Pages integration
- **vike-cloudflare** for Cloudflare-specific optimizations
- **Supabase** for database and authentication (NOT Drizzle ORM)
- **date-fns** for date formatting and manipulation

**Important**: This project uses Supabase as the database layer with auto-generated TypeScript types. There is no Drizzle ORM or `database/` directory.

## Development Commands

```bash
# Development server (default port 3000)
npm run dev

# Production build (outputs to dist/cloudflare)
npm run build

# Local Cloudflare Pages preview
npm run pages-dev

# Deploy to Cloudflare Pages
npm run pages-deploy
```

## Architecture

### Routing & Pages
- Uses Vike's **filesystem-based routing** in `/pages`
- Each route can have its own `+config.ts` to override defaults
- Global config at `pages/+config.ts` defines:
  - Server entry point: `server/index.ts`
  - Default title and head tags
  - Extensions for `vikeReact` and `vikeCloudflare`
- **Route structure**:
  - `/pages/index/*` - Public-facing blog pages (home, articles, categories, tags, profile, links)
  - `/pages/admin/*` - Admin dashboard pages (login, posts, categories, tags, links, profile management)
  - Each page uses `+Page.tsx` convention
  - Layouts use `+Layout.tsx` convention (separate layouts for public and admin areas)

### Server Configuration
- Server entry point: `server/index.ts`
- Uses **Hono** framework with `vike-cloudflare` integration
- Configured via `server: 'server/index.ts'` in `pages/+config.ts`
- Cloudflare-specific settings in `wrangler.toml`:
  - Output directory: `dist/cloudflare`
  - Compatibility flag: `nodejs_compat` (for Node.js APIs)
  - KV namespace binding: `KV` (configured in wrangler.toml)

### KV Storage
- **Cloudflare KV** used for caching (profile data, etc.)
- Accessed via `c.env.KV` in Hono context
- **Development**: Mock KV implementation in `server/utils/index.ts` automatically used when KV binding unavailable
- **Production**: Real KV namespace configured in `wrangler.toml` and Cloudflare dashboard

### Project Structure
```
/pages         - Vike pages with filesystem routing
  /index/*     - Public blog pages (home, articles, categories, tags, profile, links)
  /admin/*     - Admin dashboard pages (login, posts management, settings)
  +config.ts   - Global Vike configuration
  +Layout.tsx  - Root layout component
  +Head.tsx    - Global head tags
/layouts       - Shared layout components (if any)
/components    - Reusable React components
/supabase      - Supabase client and type definitions
  index.ts     - Auto-generated Database types, initSupabase() function, type helpers
/server        - Hono server configuration
  index.ts     - Main server entry point, mounts API router and Vike middleware
  /api         - RESTful API endpoints
    index.ts   - API router with logger and Supabase middleware injection
    article/   - Article CRUD endpoints
    category/  - Category CRUD endpoints
    tag/       - Tag CRUD endpoints
    meta/      - Meta tag endpoints
    friend-link/ - Friend link endpoints
    profile/   - Profile endpoints
    upload/    - File upload endpoints
    cache/     - KV cache management endpoints
    login/     - Authentication endpoints
    health/    - Health check endpoint
  /middleware  - Custom middleware (logger)
  /utils       - Server utilities (response helpers, createApp factory)
/assets        - Static assets (images, icons, etc.)
```

### Database Layer (Supabase)
- **Client**: `@supabase/supabase-js` for type-safe database operations
- **Types**: Auto-generated TypeScript types in `supabase/index.ts`
- **Initialization**: Use `initSupabase(options?)` function to create client instances
- **Authentication**: Access token passed via cookies and injected into Supabase client headers

#### Database Tables
Core tables:
- `article` - Blog articles with metadata (views, likes, comments)
- `category` - Article categories with emoji support
- `tag` - Article tags with usage tracking
- `article_tag` - Many-to-many article-tag relations
- `brief` - Short posts/updates
- `friend_link` - Friend links/blogroll
- `meta` - SEO meta tags
- `profile` - Site profile and author information

#### Supabase Client Pattern
```typescript
import { initSupabase } from '@/supabase'

// In API routes (with auth)
const accessToken = getCookie(c, 'access_token')
const supabase = initSupabase({
  global: {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
})

// Query example
const response = await supabase
  .from('article')
  .select('*, category(*), tags:tag(*)')
  .eq('is_published', true)
  .order('created_at', { ascending: false })
```

### TypeScript Configuration
- Build target: ES2022
- Module resolution: Bundler
- JSX: react-jsx (React 19)
- Path aliases: `@/*` maps to project root
- Types include `vite/client` and `vike-react`

## RESTful API Endpoints

The application provides a complete RESTful API built with Hono, mounted at `/api`.

### Article Endpoints

**GET** `/api/articles`
- Get list of published articles
- Returns: Articles with id, title, created_at

**GET** `/api/articles/:id`
- Get article by ID with full relations (category, tags)
- Returns: Article with nested category and tag data

**POST** `/api/articles`
- Create new article
- Body: Article data matching Supabase Insert type

**PUT** `/api/articles/:id`
- Update existing article
- Body: Partial article data

**DELETE** `/api/articles/:id`
- Delete article by ID

### Category Endpoints

**GET** `/api/categories`
- Get all categories

**GET** `/api/categories/:id`
- Get category by ID

**POST** `/api/categories`
- Create new category

**PUT** `/api/categories/:id`
- Update category

**DELETE** `/api/categories/:id`
- Delete category

### Tag Endpoints

**GET** `/api/tags`
- Get all tags

**GET** `/api/tags/:id`
- Get tag by ID

**POST** `/api/tags`
- Create new tag

**PUT** `/api/tags/:id`
- Update tag

**DELETE** `/api/tags/:id`
- Delete tag

### Other Endpoints

**GET/POST/PUT/DELETE** `/api/meta`
- Manage SEO meta tags

**GET/POST/PUT/DELETE** `/api/friend-links`
- Manage friend links/blogroll

**GET/PUT** `/api/profile`
- Get or update site profile

**POST** `/api/upload`
- Upload files

**GET/DELETE** `/api/cache`
- Manage KV cache

**POST** `/api/login`
- Authentication endpoint

**GET** `/api/health`
- Health check endpoint

### API Response Format

All endpoints use a standardized response helper from `server/utils/response.ts`:

```typescript
// Success response
result.from(c, supabaseResponse)

// Error response
result.error(c, message, statusCode)
```

### API Middleware

- **Logger**: Applied to all API routes via `server/middleware/logger.ts`
- **Supabase Injection**: Automatically injects authenticated Supabase client into Hono context
  - Reads `access_token` from cookies
  - Creates Supabase client with Authorization header
  - Available via `c.get('supabase')` in all API routes
- **Error Handler**: Global error handler for unhandled exceptions

### Authentication Pattern

Authentication uses cookie-based tokens:
```typescript
// In API routes - get authenticated Supabase client
const supabase = c.get('supabase')

// Access token is automatically injected from cookies by middleware
// Cookie name: 'access_token'
```

## Cloudflare Pages Deployment

The build process creates a Cloudflare-compatible bundle in `dist/cloudflare`. The separation between `build` and `pages-dev`/`pages-deploy` scripts ensures Wrangler commands run only after the Vike build completes.

### Environment Variables
- **Local Development**: Create `.env` file (see `.env.example`)
- **Production**: Configure in Cloudflare Pages dashboard under Settings > Environment variables
- **Required Variables**:
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_KEY`: Your Supabase anon/public key
  - `DATABASE_URL`: PostgreSQL connection string (optional, for direct database access)

## Coding Conventions

### Code Style
- TypeScript with strict mode
- Two-space indentation
- Single quotes for strings
- ES module syntax (`import`/`export`)
- Path aliases: `@/*` maps to project root

### Naming Conventions
- **Components**: PascalCase (e.g., `ArticleList.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useArticles`)
- **Utilities**: camelCase (e.g., `formatDate`)
- **Environment variables**: SCREAMING_SNAKE_CASE (e.g., `SUPABASE_URL`)
- **Vike folders**: Use descriptive names matching routes (e.g., `/pages/index/profile/`)

### File Organization
- Keep Vike pages in `/pages` with `+Page.tsx` convention
- Co-locate page-specific components near their pages
- Share reusable components in `/components`
- Keep API route handlers in `/server/api/{resource}/{resource}.route.ts`
- Use `index.ts` for clean re-exports from modules

## Development Workflow

### Testing
- No automated test runner currently configured
- Smoke test with `npm run dev` before committing
- Test Cloudflare-specific features with `npm run pages-dev`
- Verify API endpoints work correctly after changes

### Commit Guidelines
Follow Conventional Commits format (as seen in git history):
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - Code style changes (formatting, CSS)
- `refactor:` - Code refactoring
- `docs:` - Documentation updates
- `chore:` - Maintenance tasks

Example: `feat(admin): Add basic structure for admin login page`

## Common Patterns

### Creating New API Endpoints
1. Create route file in `/server/api/{resource}/{resource}.route.ts`
2. Use `createApp()` factory from `server/utils`
3. Access Supabase client via `c.get('supabase')`
4. Use `result.from()` or `result.error()` for responses
5. Register route in `/server/api/index.ts`

### Adding New Pages
1. Create folder in `/pages/index/` or `/pages/admin/`
2. Add `+Page.tsx` file
3. Optionally add `+Layout.tsx` for custom layout
4. Optionally add `+config.ts` for page-specific config
5. Use Vike's filesystem routing (no manual route registration needed)

### Working with Supabase
- Always use `initSupabase()` function from `/supabase/index.ts`
- Use auto-generated types: `Tables<'table_name'>`, `TablesInsert<'table_name'>`, `TablesUpdate<'table_name'>`
- In API routes, get authenticated client via `c.get('supabase')`
- Handle Supabase errors properly and return appropriate HTTP status codes
