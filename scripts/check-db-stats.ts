// scripts/check-db-stats.ts
/**
 * 检查数据库统计信息
 * 用于验证数据完整性和查看数据库状态
 *
 * Usage: npm run db:stats
 * Reads DATABASE_URL from .env or environment variables
 */

import { config } from 'dotenv'
import postgres from 'postgres'

// Load .env file
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('\nPlease set DATABASE_URL in one of these ways:')
  console.error('  1. Create .env file (see .env.example)')
  console.error('  2. Set in wrangler.toml under [vars] section')
  console.error('  3. Pass directly: DATABASE_URL=your_url npm run db:stats')
  process.exit(1)
}

const sql = postgres(DATABASE_URL)

async function checkStats() {
  console.log('🔍 Database Statistics\n')

  try {
    // Check users
    const users = await sql`SELECT COUNT(*) as count FROM "user"`
    console.log(`👥 Users: ${users[0].count}`)

    // Check categories
    const categories = await sql`SELECT COUNT(*) as count FROM category`
    console.log(`📁 Categories: ${categories[0].count}`)

    // Check tags
    const tags = await sql`SELECT COUNT(*) as count FROM tag`
    console.log(`🏷️  Tags: ${tags[0].count}`)

    // Check articles
    const articles = await sql`SELECT COUNT(*) as count FROM article`
    const publishedArticles = await sql`SELECT COUNT(*) as count FROM article WHERE is_published = true`
    console.log(`📝 Articles: ${articles[0].count} (${publishedArticles[0].count} published)`)

    // Check article-tag relations
    const articleTags = await sql`SELECT COUNT(*) as count FROM article_tag`
    console.log(`🔗 Article-Tag Relations: ${articleTags[0].count}`)

    // Check comments
    const comments = await sql`SELECT COUNT(*) as count FROM comment`
    console.log(`💬 Comments: ${comments[0].count}`)

    // Check files
    const files = await sql`SELECT COUNT(*) as count FROM file`
    console.log(`📎 Files: ${files[0].count}`)

    // Check friend links
    const friendLinks = await sql`SELECT COUNT(*) as count FROM friend_link`
    console.log(`🔗 Friend Links: ${friendLinks[0].count}`)

    // Check site config
    const sites = await sql`SELECT COUNT(*) as count FROM site`
    console.log(`⚙️  Site Configs: ${sites[0].count}`)

    // Check meta tags
    const meta = await sql`SELECT COUNT(*) as count FROM meta`
    console.log(`🏷️  Meta Tags: ${meta[0].count}`)

    console.log('\n📋 Recent articles:')
    const recentArticles = await sql`
      SELECT a.id, a.title, a.is_published, u.username as author, c.name as category,
             a.view_count, a.like_count, a.comment_count
      FROM article a
      LEFT JOIN "user" u ON a.author_id = u.id
      LEFT JOIN category c ON a.category_id = c.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `
    console.table(recentArticles)

    console.log('\n✅ Stats retrieved successfully!')

  } catch (error) {
    console.error('❌ Failed to retrieve stats:', error)
    throw error
  } finally {
    await sql.end()
  }
}

checkStats().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
