# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a blog application built with Vike + React, configured for deployment to Cloudflare Pages. The stack includes:
- **Vike** (v0.4.239): Full-stack React framework with SSR support
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Hono** server for Cloudflare Workers/Pages integration
- **vike-cloudflare** for Cloudflare-specific optimizations
- **Supabase** for database and authentication
- **date-fns** for date formatting and manipulation

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
  - Default `Layout` component from `/layouts/LayoutDefault.tsx`
  - Default title and head tags
  - Extensions for `vikeReact` and `vikeCloudflare`

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
/layouts       - Layout components (LayoutDefault.tsx)
/components    - Reusable React components
/supabase      - Supabase client and type definitions
  index.ts     - Database types and initSupabase() function
/server        - Hono server configuration
  index.ts     - Main server entry point
  /api         - RESTful API endpoints
    index.ts   - API router with Supabase middleware
    article/   - Article endpoints
    category/  - Category endpoints
    tag/       - Tag endpoints
    meta/      - Meta tag endpoints
    friend-link/ - Friend link endpoints
    profile/   - Profile endpoints
    upload/    - File upload endpoints
    cache/     - Cache management endpoints
    login/     - Authentication endpoints
    health/    - Health check endpoint
  /middleware  - Custom middleware (logger)
  /utils       - Server utilities (response helpers, createApp)
/assets        - Static assets
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
- **Supabase Injection**: Automatically injects authenticated Supabase client into context
- **Error Handler**: Global error handler for unhandled exceptions

## Cloudflare Pages Deployment

The build process creates a Cloudflare-compatible bundle in `dist/cloudflare`. The separation between `build` and `pages-dev`/`pages-deploy` scripts ensures Wrangler commands run only after the Vike build completes.

### Environment Variables
- **Local Development**: Create `.env` file (see `.env.example`)
- **Production**: Configure in Cloudflare Pages dashboard under Settings > Environment variables
- **Required Variables**:
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_KEY`: Your Supabase anon/public key
  - `DATABASE_URL`: PostgreSQL connection string (optional, for direct database access)
