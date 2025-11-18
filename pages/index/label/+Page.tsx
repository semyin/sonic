export { Page };

import { useState } from 'react';
import styles from './label.module.scss';

function Page() {
  const [tags] = useState([
    {
      id: 'all',
      name: '全部',
      posts: [
        { id: 1, title: '如何构建一个简约的静态博客', date: '2024-08-19' },
        { id: 2, title: 'JavaScript 异步编程最佳实践', date: '2024-08-05' },
        { id: 3, title: 'CSS Grid 完全指南', date: '2024-08-01' },
        { id: 4, title: '前端工程化入门指南', date: '2024-07-22' },
        { id: 5, title: 'TypeScript 项目最佳实践', date: '2024-07-10' },
        { id: 6, title: '极简设计的美学原则', date: '2024-08-15' },
        { id: 7, title: '数字时代的深度思考', date: '2024-08-10' }
      ]
    },
    {
      id: 'tech',
      name: '技术',
      posts: [
        { id: 1, title: '如何构建一个简约的静态博客', date: '2024-08-19' },
        { id: 2, title: 'JavaScript 异步编程最佳实践', date: '2024-08-05' },
        { id: 3, title: 'CSS Grid 完全指南', date: '2024-08-01' },
        { id: 4, title: '前端工程化入门指南', date: '2024-07-22' },
        { id: 5, title: 'TypeScript 项目最佳实践', date: '2024-07-10' }
      ]
    },
    {
      id: 'frontend',
      name: '前端',
      posts: [
        { id: 1, title: '如何构建一个简约的静态博客', date: '2024-08-19' },
        { id: 4, title: '前端工程化入门指南', date: '2024-07-22' }
      ]
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      posts: [
        { id: 2, title: 'JavaScript 异步编程最佳实践', date: '2024-08-05' },
        { id: 5, title: 'TypeScript 项目最佳实践', date: '2024-07-10' }
      ]
    },
    {
      id: 'css',
      name: 'CSS',
      posts: [
        { id: 3, title: 'CSS Grid 完全指南', date: '2024-08-01' }
      ]
    },
    {
      id: 'design',
      name: '设计',
      posts: [
        { id: 6, title: '极简设计的美学原则', date: '2024-08-15' }
      ]
    },
    {
      id: 'uiux',
      name: 'UI/UX',
      posts: [
        { id: 6, title: '极简设计的美学原则', date: '2024-08-15' }
      ]
    },
    {
      id: 'life',
      name: '生活',
      posts: [
        { id: 7, title: '数字时代的深度思考', date: '2024-08-10' }
      ]
    },
    {
      id: 'thinking',
      name: '思考',
      posts: [
        { id: 7, title: '数字时代的深度思考', date: '2024-08-10' }
      ]
    }
  ]);

  const [activeTagId, setActiveTagId] = useState('all');

  const activeTag = tags.find(t => t.id === activeTagId);

  return (
    <>
      <h1>标签</h1>
      <p className={styles.pageDescription}>按标签类型浏览文章</p>

      <section className={styles.tagSwitcher}>
        {tags.map(tag => (
          <button
            key={tag.id}
            className={`${styles.tagItem} ${tag.id === activeTagId ? styles.active : ''}`}
            onClick={() => setActiveTagId(tag.id)}
          >
            <span className={styles.tagName}>{tag.name}</span>
            <span className={styles.tagCount}>{tag.posts.length}</span>
          </button>
        ))}
      </section>

      {activeTag && (
        <section className={styles.tagPanel}>
          <div className={styles.tagPostsHeader}>
            <h2>{activeTag.id === 'all' ? '全部文章' : `标签：${activeTag.name}`}</h2>
            <p>{activeTag.posts.length} 篇文章</p>
          </div>

          <ul className={styles.postList}>
            {activeTag.posts.map(post => (
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