// database/schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  bigint,
  pgEnum,
  primaryKey,
  unique,
  index
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ===================== ENUMS =====================
export const targetTypeEnum = pgEnum('target_type', ['article', 'brief', 'comment'])
export const likeTargetTypeEnum = pgEnum('like_target_type', ['article', 'brief'])
export const notificationTypeEnum = pgEnum('notification_type', ['comment', 'like', 'reply'])
export const articleTypeEnum = pgEnum('article_type', ['article', 'about', 'privacy'])

// ===================== USERS =====================
export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  pushType: varchar('push_type', { length: 50 }),
  pushUrl: varchar('push_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===================== CATEGORIES =====================
export const categories = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===================== TAGS =====================
export const tags = pgTable('tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===================== ARTICLES =====================
export const articles = pgTable('article', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  summary: varchar('summary', { length: 500 }),
  authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  tags: varchar('tags', { length: 255 }), // 保留原有的逗号分隔标签字段（用于兼容）
  coverImage: varchar('cover_image', { length: 255 }),
  isPublished: boolean('is_published').default(false).notNull(),
  isTop: boolean('is_top').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  type: varchar('type', { length: 50 }).default('article').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('article_author_idx').on(table.authorId),
  categoryIdx: index('article_category_idx').on(table.categoryId),
}))

// ===================== ARTICLE_TAG (Many-to-Many) =====================
export const articleTags = pgTable('article_tag', {
  articleId: integer('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.articleId, table.tagId] }),
  tagIdx: index('article_tag_tag_idx').on(table.tagId),
}))

// ===================== BRIEFS =====================
export const briefs = pgTable('brief', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublished: boolean('is_published').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('brief_author_idx').on(table.authorId),
}))

// ===================== COMMENTS =====================
export const comments = pgTable('comment', {
  id: serial('id').primaryKey(),
  targetId: integer('target_id').notNull(),
  targetType: targetTypeEnum('target_type').notNull(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentCommentId: integer('parent_comment_id').references((): any => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('comment_user_idx').on(table.userId),
  parentIdx: index('comment_parent_idx').on(table.parentCommentId),
  targetIdx: index('comment_target_idx').on(table.targetId, table.targetType),
}))

// ===================== LIKES =====================
export const likes = pgTable('like', {
  id: serial('id').primaryKey(),
  targetId: integer('target_id').notNull(),
  targetType: likeTargetTypeEnum('target_type').notNull(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueLike: unique('unique_like').on(table.targetId, table.targetType, table.userId),
  userIdx: index('like_user_idx').on(table.userId),
}))

// ===================== VIEWS =====================
export const views = pgTable('view', {
  id: serial('id').primaryKey(),
  targetId: integer('target_id').notNull(),
  targetType: likeTargetTypeEnum('target_type').notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('view_user_idx').on(table.userId),
  targetIdx: index('view_target_idx').on(table.targetId, table.targetType),
}))

// ===================== NOTIFICATIONS =====================
export const notifications = pgTable('notification', {
  id: serial('id').primaryKey(),
  targetId: integer('target_id').notNull(),
  targetType: likeTargetTypeEnum('target_type').notNull(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notification_user_idx').on(table.userId),
}))

// ===================== FILES =====================
export const files = pgTable('file', {
  id: bigint('id', { mode: 'bigint' }).primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalname: varchar('originalname', { length: 255 }).notNull(),
  mimetype: varchar('mimetype', { length: 255 }).notNull(),
  size: integer('size').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  cosKey: varchar('cos_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===================== FRIEND LINKS =====================
export const friendLinks = pgTable('friend_link', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  description: text('description'),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  type: varchar('type', { length: 50 }).default('default'),
  sortWeight: integer('sort_weight').default(0).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===================== SITE CONFIG =====================
export const site = pgTable('site', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  description: text('description'),
  copyright: varchar('copyright', { length: 255 }),
  icp: varchar('icp', { length: 255 }),
  runTime: timestamp('run_time').defaultNow(),
}, (table) => ({
  uniqueId: unique('site_unique_id').on(table.id),
}))

// ===================== META TAGS =====================
export const meta = pgTable('meta', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  property: varchar('property', { length: 255 }),
  content: text('content'),
  isDefault: boolean('is_default').default(false).notNull(),
  resourceType: varchar('resource_type', { length: 50 }),
  resourceId: integer('resource_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  resourceIdx: index('meta_resource_idx').on(table.resourceType, table.resourceId),
}))

// ===================== RELATIONS =====================
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  briefs: many(briefs),
  comments: many(comments),
  likes: many(likes),
  notifications: many(notifications),
}))

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  articleTags: many(articleTags),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  articleTags: many(articleTags),
}))

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}))

export const briefsRelations = relations(briefs, ({ one }) => ({
  author: one(users, {
    fields: [briefs.authorId],
    references: [users.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
  replies: many(comments),
}))

// ===================== TYPE EXPORTS =====================
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

export type ArticleTag = typeof articleTags.$inferSelect
export type NewArticleTag = typeof articleTags.$inferInsert

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export type Like = typeof likes.$inferSelect
export type NewLike = typeof likes.$inferInsert

export type View = typeof views.$inferSelect
export type NewView = typeof views.$inferInsert

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert

export type File = typeof files.$inferSelect
export type NewFile = typeof files.$inferInsert

export type FriendLink = typeof friendLinks.$inferSelect
export type NewFriendLink = typeof friendLinks.$inferInsert

export type Site = typeof site.$inferSelect
export type NewSite = typeof site.$inferInsert

export type Meta = typeof meta.$inferSelect
export type NewMeta = typeof meta.$inferInsert
