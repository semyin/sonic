export { PostList }

import { Link } from '@/components/Link'

type Post = {
  id: number
  title: string
  created_at: string
}

type PostListProps = {
  posts: Post[]
}

function PostList({ posts }: PostListProps) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id}>
          <time>{formatDate(post.created_at)}</time>
          <Link href={`/p/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
