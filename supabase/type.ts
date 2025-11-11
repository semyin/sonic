// article 类型（与数据库中的列一一对应）
export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  category_id?: number | null;
  cover_image?: string | null;
  is_published: boolean;   // default: false
  is_top: boolean;         // default: false
  view_count: number;      // default: 0
  like_count: number;      // default: 0
  comment_count: number;   // default: 0
  created_at: string;      // timestamp without time zone, ISO string
  updated_at: string;      // timestamp without time zone, ISO string
  author_id?: string | null; // uuid, default: auth.uid()
}

// 用于创建新文章（插入）时的类型
// 删去数据库自动生成或有默认值的字段（id, created_at, updated_at）
export type ArticleInsert = Omit<
  Partial<Article>,
  'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'comment_count'
> & {
  title: string;
  content: string;
  // 可选字段（可显式提供，也可由 DB 使用默认值）
  summary?: string | null;
  category_id?: number | null;
  cover_image?: string | null;
  is_published?: boolean;
  is_top?: boolean;
  author_id?: string | null;
};

// 用于更新文章的类型（所有字段可选，id 单独用于定位）
export type ArticleUpdate = Partial<
  Omit<Article, 'created_at' | 'updated_at' | 'id'>
> & {
  id: number;
};