export { Page };

import { PostList } from '@/components/PostList';

function Page() {
  const posts = [
    { id: 1, title: '全栈开发实战：使用 React, Node.js 和 Express 构建一个实时聊天应用', created_at: '2025-01-01' },
    { id: 2, title: '后端语言大比拼：Java (Spring Boot) vs. Python (Django) vs. Node.js (Express) 我该如何选择？', created_at: '2025-01-02' },
    { id: 3, title: 'API 设计的艺术：如何为你的 JavaScript 前端设计优雅的 RESTful API (以 Node.js 和 Spring Boot 为例)', created_at: '2025-01-03' },
    { id: 4, title: 'Python 异步编程入门：从 asyncio 基础到实战爬虫应用', created_at: '2025-01-04' },
    { id: 5, title: '数据科学项目实战：用 Python 和 Pandas 清洗并分析一份真实数据集', created_at: '2025-01-05' },
    { id: 6, title: '深入理解 Spring Boot 自动配置原理，告别"知其然不知其所以然"', created_at: '2025-01-06' },
    { id: 7, title: '揭秘 Node.js 事件循环 (Event Loop)：从宏任务到微任务的底层逻辑', created_at: '2025-01-07' },
    { id: 8, title: '告别回调地狱：掌握 Node.js 中 Promise 和 Async/Await 的终极指南', created_at: '2025-01-08' },
    { id: 9, title: 'React Hooks 全面解析：useState, useEffect 及自定义 Hooks 使用详解', created_at: '2025-01-09' },
    { id: 10, title: '2024年 React 状态管理方案选型：Redux Toolkit, Zustand, Recoil 还是原生 Context？', created_at: '2025-01-10' },
    { id: 11, title: 'React 性能优化：memo, useMemo 和 useCallback 的正确使用场景', created_at: '2025-01-11' },
    { id: 12, title: '从零到一：使用 Spring Boot + React + Docker 部署你的个人博客系统', created_at: '2025-01-12' },
    { id: 13, title: '编写优雅的 Pythonic 代码：超越基础语法的8个必知技巧', created_at: '2025-01-13' },
    { id: 14, title: 'Node.js 性能优化：编写高并发应用的 7 个最佳实践', created_at: '2025-01-14' },
    { id: 15, title: 'MySQL转Drizzle数据库架构', created_at: '2025-01-15' },
    { id: 16, title: 'iOS内嵌H5解析JSON问题', created_at: '2025-01-16' }
  ];

  return (
    <>
      <h1 className='page-h1'>Posts</h1>
      <PostList posts={posts} />
    </>
  )
}