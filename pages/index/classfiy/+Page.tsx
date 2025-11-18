export { Page };

import { useState } from 'react';
import styles from './classfiy.module.scss';

function Page() {
  const [categories] = useState([
    {
      id: 1,
      name: '技术',
      icon: '💻',
      description: '编程、开发、技术分享',
      posts: [
        { id: 1, title: '全栈开发实战：使用 React、Node.js 和 Express 构建实时聊天应用', date: '2025-01-01' },
        { id: 2, title: '告别回调地狱：掌握 Node.js 的 Promise 与 Async/Await', date: '2025-01-08' },
        { id: 3, title: 'React 性能优化：memo、useMemo 与 useCallback 的使用场景', date: '2025-01-11' }
      ]
    },
    {
      id: 2,
      name: '设计',
      icon: '🎨',
      description: 'UI / UX、视觉设计',
      posts: [
        { id: 4, title: '设计系统 2.0：从组件到视觉语言的落地实践', date: '2025-02-01' }
      ]
    },
    {
      id: 3,
      name: '生活',
      icon: '🌱',
      description: '生活感悟、个人思考',
      posts: [
        { id: 5, title: 'iOS 内嵌 H5 解析 JSON 的那些坑', date: '2025-01-16' }
      ]
    },
    {
      id: 4,
      name: '学习',
      icon: '📚',
      description: '学习笔记、知识分享',
      posts: []
    }
  ]);

  const [activeId, setActiveId] = useState(1);

  const activeCategory = categories.find(c => c.id === activeId);

  return (
    <>
      <h1>所有分类</h1>

      <div className={styles.list}>
        <ul>
          {categories.map(category => (
            <li key={category.id} className={category.id === activeId ? styles['is-active'] : ''}>
              <button type="button" className={styles.categoryLink} onClick={() => setActiveId(category.id)}>
                <span className={styles.categoryIcon} aria-hidden="true">{category.icon}</span>
                <div className={styles.categoryContent}>
                  <div className={styles.categoryHead}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>{category.posts.length} 篇</span>
                  </div>
                  <div className={styles.categoryMeta}>{category.description}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeCategory && (
        <section className={styles.categoryPosts}>
          <div className={styles.categoryPostsHeader}>
            <h2>分类：{activeCategory.name}</h2>
            <p>{activeCategory.posts.length} 篇文章</p>
          </div>

          <ul className={styles.postList}>
            {activeCategory.posts.map(post => (
              <li key={post.id}>
                <time dateTime={post.date}>{post.date}</time>
                <a href="#">{post.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}