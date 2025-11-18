export { Page };

import { useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import styles from './p.module.scss';

function Page() {
  const pageContext = usePageContext();
  const articleId = pageContext.routeParams.id;

  // 模拟文章数据
  const [article] = useState({
    id: articleId,
    title: '全栈开发实战：使用 React、Node.js 和 Express 构建实时聊天应用',
    content: `在这篇文章中，我将带你从零开始构建一个功能完整的实时聊天应用。

## 技术栈

我们将使用以下技术栈：

- **前端**：React + TypeScript + Tailwind CSS
- **后端**：Node.js + Express + Socket.io
- **数据库**：PostgreSQL
- **部署**：Vercel + Railway

## 项目初始化

首先，让我们创建项目的基本结构：

\`\`\`bash
mkdir chat-app
cd chat-app
npm init -y
\`\`\`

## 安装依赖

接下来安装必要的依赖包：

\`\`\`bash
npm install express socket.io cors
npm install -D typescript @types/node @types/express
\`\`\`

## 创建服务器

创建一个基本的 Express 服务器：

\`\`\`javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## 实现实时消息

使用 Socket.io 实现实时消息推送：

> 注意：确保客户端和服务端的 Socket.io 版本兼容。

## 总结

通过这个项目，我们学习了如何：

1. 搭建 Express 服务器
2. 集成 Socket.io 实现实时通信
3. 使用 React 构建用户界面
4. 部署全栈应用

希望这篇文章对你有所帮助！`,
    category: {
      id: 1,
      name: '技术',
      emoji: '💻'
    },
    tags: [
      { id: 1, name: 'React' },
      { id: 2, name: 'Node.js' },
      { id: 3, name: 'WebSocket' }
    ],
    author: '森亦',
    createdAt: '2025-01-15',
    viewCount: 1234,
    likeCount: 56,
    commentCount: 12
  });

  return (
    <div className={styles.articleContainer}>
      {/* 文章头部 */}
      <header className={styles.articleHeader}>
        <h1 className={styles.articleTitle}>{article.title}</h1>

        <div className={styles.articleMeta}>
          <div className={styles.metaItem}>
            <span>👁️‍🗨️</span>
            <span>{article.viewCount} 阅读</span>
          </div>
          <div className={styles.metaItem}>
            <span>📅</span>
            <time dateTime={article.createdAt}>{article.createdAt}</time>
          </div>
          <a href="#" className={styles.category}>
            <span>{article.category.emoji}</span>
            <span>{article.category.name}</span>
          </a>
        </div>

        {article.tags.length > 0 && (
          <div className={styles.tags}>
            {article.tags.map(tag => (
              <a key={tag.id} href="#" className={styles.tag}>
                #{tag.name}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <article className={styles.articleContent}>
        {article.content.split('\n').map((paragraph, index) => {
          // 简单的 Markdown 解析（实际项目中应使用专业的 Markdown 解析库）
          if (paragraph.startsWith('## ')) {
            return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
          } else if (paragraph.startsWith('> ')) {
            return <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote>;
          } else if (paragraph.startsWith('```')) {
            return null; // 代码块需要特殊处理
          } else if (paragraph.match(/^\d+\./)) {
            return <li key={index}>{paragraph.replace(/^\d+\.\s/, '')}</li>;
          } else if (paragraph.trim() === '') {
            return null;
          } else if (paragraph.startsWith('- **')) {
            const match = paragraph.match(/- \*\*(.+?)\*\*：(.+)/);
            if (match) {
              return <p key={index}><strong>{match[1]}</strong>：{match[2]}</p>;
            }
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </article>

      {/* 文章底部 */}
      <footer className={styles.articleFooter}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>👁️</span>
            <span>{article.viewCount} 阅读</span>
          </div>
          <div className={styles.statItem}>
            <span>❤️</span>
            <span>{article.likeCount} 点赞</span>
          </div>
          <div className={styles.statItem}>
            <span>💬</span>
            <span>{article.commentCount} 评论</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
