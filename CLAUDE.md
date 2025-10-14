# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a blog application built with Vike + React, configured for deployment to Cloudflare Pages. The stack includes:
- **Vike** (v0.4.239): Full-stack React framework with SSR support
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Hono** server for Cloudflare Workers/Pages integration
- **vike-cloudflare** for Cloudflare-specific optimizations
- **Drizzle ORM** with PostgreSQL for database management

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

# Database commands
npm run db:generate  # Generate migration files from schema
npm run db:migrate   # Run pending migrations
npm run db:push      # Push schema changes directly (dev only)
npm run db:studio    # Open Drizzle Studio (database GUI)
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

### Project Structure
```
/pages         - Vike pages with filesystem routing
/layouts       - Layout components (LayoutDefault.tsx)
/components    - Reusable React components
/database      - Database layer with Drizzle ORM
  schema.ts    - Complete database schema (15 tables)
  client.ts    - Database connection configuration
  article.ts   - Article service with CRUD operations
  category.ts  - Category management service
  tag.ts       - Tag management service
  types.ts     - TypeScript type definitions
/server        - Hono server configuration
  index.ts     - Main server entry point
  /api         - RESTful API endpoints
    index.ts   - API router
    article.ts - Article endpoints
    category.ts- Category endpoints
    tag.ts     - Tag endpoints
/scripts       - Utility scripts (migration, etc.)
/assets        - Static assets
```

### Database Layer (Drizzle ORM)
- **ORM**: Drizzle ORM for type-safe database operations
- **Driver**: `postgres` for PostgreSQL connections
- **Schema**: Complete blog schema with 15 tables in `database/schema.ts`
- **Migrations**: Generated in `database/migrations/` (gitignored)
- **Configuration**: `drizzle.config.ts` for Drizzle Kit
- **Platform-agnostic**: Can easily switch between PostgreSQL providers (Supabase, Neon, Railway, etc.)

#### Available Services
- `ArticleService` - Article CRUD with relations (author, category, tags)
- `CategoryService` - Category management
- `TagService` - Tag management with article associations

#### Database Tables
Core tables:
- `user` - User accounts with auth and profile info
- `article` - Blog articles with metadata (views, likes, comments)
- `category` - Article categories
- `tag` - Article tags
- `article_tag` - Many-to-many article-tag relations
- `brief` - Short posts/updates
- `comment` - Nested comments for articles/briefs
- `like` - User likes for articles/briefs
- `view` - View tracking
- `notification` - User notifications
- `file` - File uploads metadata
- `friend_link` - Friend links/blogroll
- `site` - Site-wide configuration
- `meta` - SEO meta tags

#### Database Usage Pattern
```typescript
import { getDb } from '../database/client'
import { ArticleService } from '../database/article'
import { CategoryService } from '../database/category'
import { TagService } from '../database/tag'

const db = getDb({ DATABASE_URL: env.DATABASE_URL })
const articleService = new ArticleService(db)
const categoryService = new CategoryService(db)
const tagService = new TagService(db)

// Article operations
const articles = await articleService.getPublishedArticles(1, 10)
const article = await articleService.getArticleById(1)
await articleService.createArticle({
  title: 'My Post',
  content: 'Content...',
  authorId: 1,
  categoryId: 1,
  tagIds: [1, 2, 3],
  isPublished: true
})

// Category operations
const categories = await categoryService.getAllCategories()
await categoryService.createCategory({ name: 'Tech', description: 'Tech posts' })

// Tag operations
const tags = await tagService.getAllTags()
const postTags = await tagService.getTagsForArticle(1)
```

#### Article Table Schema
- `id` (serial, primary key)
- `title` (varchar 255)
- `content` (text)
- `summary` (varchar 500, nullable)
- `authorId` (integer, foreign key to user)
- `categoryId` (integer, foreign key to category, nullable)
- `tags` (varchar 255, comma-separated, for compatibility)
- `coverImage` (varchar 255, nullable)
- `isPublished` (boolean, default false)
- `isTop` (boolean, default false)
- `viewCount` (integer, default 0)
- `likeCount` (integer, default 0)
- `commentCount` (integer, default 0)
- `type` (varchar 50, default 'article')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### TypeScript Configuration
- Build target: ES2022
- Module resolution: Bundler
- JSX: react-jsx (React 19)
- Types include `vite/client` and `vike-react`

## RESTful API Endpoints

The application provides a complete RESTful API built with Hono, mounted at `/api`.

### Article Endpoints

**GET** `/api/articles`
- Get paginated list of published articles
- Query params: `page` (default: 1), `pageSize` (default: 10)
- Returns: Articles with author, category, and pagination info

**GET** `/api/articles/:id`
- Get article by ID with full relations (author, category, tags)
- Automatically increments view count
- Returns: 404 if not found

**GET** `/api/articles/category/:categoryId`
- Get articles filtered by category
- Query params: `page`, `pageSize`

**GET** `/api/articles/tag/:tagId`
- Get articles filtered by tag
- Query params: `page`, `pageSize`

**POST** `/api/articles`
- Create new article
- Body: `{ title, content, summary?, authorId, categoryId?, tagIds?, coverImage?, isPublished?, isTop? }`
- Returns: Created article (201)

**PUT** `/api/articles/:id`
- Update existing article
- Body: Same as POST (all fields optional)
- Returns: Updated article or 404

**DELETE** `/api/articles/:id`
- Delete article (cascades to article_tag relations)
- Returns: Success message

**POST** `/api/articles/:id/like`
- Increment article like count
- Returns: Success message

### Category Endpoints

**GET** `/api/categories`
- Get all categories (ordered by creation date)

**GET** `/api/categories/:id`
- Get category by ID
- Returns: 404 if not found

**POST** `/api/categories`
- Create new category
- Body: `{ name, description? }`
- Returns: Created category (201)

**PUT** `/api/categories/:id`
- Update category
- Body: `{ name?, description? }`
- Returns: Updated category or 404

**DELETE** `/api/categories/:id`
- Delete category
- Returns: Success message

### Tag Endpoints

**GET** `/api/tags`
- Get all tags

**GET** `/api/tags/:id`
- Get tag by ID
- Returns: 404 if not found

**GET** `/api/tags/name/:name`
- Get tag by name
- Returns: 404 if not found

**POST** `/api/tags`
- Create new tag
- Body: `{ name, description? }`
- Returns: Created tag (201)

**POST** `/api/tags/bulk`
- Create or retrieve multiple tags by name
- Body: `{ names: string[] }`
- Returns: Array of tags

**PUT** `/api/tags/:id`
- Update tag
- Body: `{ name?, description? }`
- Returns: Updated tag or 404

**DELETE** `/api/tags/:id`
- Delete tag (cascades to article_tag relations)
- Returns: Success message

### API Response Format

All endpoints return responses in this format:

**Success:**
```json
{
  "success": true,
  "data": { /* result */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### API Usage Example

```typescript
// Fetch published articles
const response = await fetch('/api/articles?page=1&pageSize=10')
const { data } = await response.json()
console.log(data.articles) // Array of articles
console.log(data.pagination) // Pagination info

// Get article by ID
const articleRes = await fetch('/api/articles/1')
const { data: article } = await articleRes.json()

// Create article
const createRes = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Article',
    content: 'Content here...',
    authorId: 1,
    categoryId: 2,
    tagIds: [1, 2, 3],
    isPublished: true
  })
})
```

## Cloudflare Pages Deployment

The build process creates a Cloudflare-compatible bundle in `dist/cloudflare`. The separation between `build` and `pages-dev`/`pages-deploy` scripts ensures Wrangler commands run only after the Vike build completes.

### Environment Variables
- **Local Development**: Set `DATABASE_URL` in `wrangler.toml` under `[vars]` section
- **Production**: Configure in Cloudflare Pages dashboard under Settings > Environment variables
- **Format**: `postgresql://username:password@host:port/database`
- **Example**: `.env.example` contains templates for various PostgreSQL providers

### Database Setup
1. Create a PostgreSQL database on your preferred platform (Supabase, Neon, Railway, etc.)
2. Copy connection string to `wrangler.toml` under `[vars]` or use `.env.local`
3. Run `npm run db:push` to create all tables
4. (Optional) Migrate existing MySQL data using `tsx scripts/migrate-from-mysql.ts`

### Data Migration from MySQL
If migrating from an existing MySQL database:
1. Install mysql2: `npm install mysql2`
2. Set environment variables for MySQL connection
3. Run migration script: `tsx scripts/migrate-from-mysql.ts`
4. See `MIGRATION.md` for detailed instructions and troubleshooting
