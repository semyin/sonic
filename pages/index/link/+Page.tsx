export { Page };

import { useState } from 'react';
import styles from './link.module.scss';

function Page() {
  const [links] = useState([
    {
      id: 1,
      name: 'GitHub',
      url: 'https://github.com',
      description: '全球最大的代码托管平台，开发者的聚集地',
      avatar: '🐙'
    },
    {
      id: 2,
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      description: 'Web 开发者的权威文档和学习资源',
      avatar: '📚'
    },
    {
      id: 3,
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      description: '程序员问答社区，解决技术难题的好帮手',
      avatar: '💬'
    },
    {
      id: 4,
      name: 'React',
      url: 'https://react.dev',
      description: '用于构建用户界面的 JavaScript 库',
      avatar: '⚛️'
    },
    {
      id: 5,
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org',
      description: 'JavaScript 的超集，添加了类型系统',
      avatar: '🔷'
    },
    {
      id: 6,
      name: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: '实用优先的 CSS 框架',
      avatar: '🎨'
    },
    {
      id: 7,
      name: 'Node.js',
      url: 'https://nodejs.org',
      description: '基于 Chrome V8 引擎的 JavaScript 运行时',
      avatar: '🟢'
    },
    {
      id: 8,
      name: 'Vercel',
      url: 'https://vercel.com',
      description: '前端开发者的部署平台',
      avatar: '▲'
    }
  ]);

  return (
    <>
      <h1 className='page-h1'>友情链接</h1>
      <p className='page-description'>推荐的优质网站和资源</p>

      {links.length > 0 ? (
        <div className={styles.linkGrid}>
          {links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkCard}
            >
              <div className={styles.linkAvatar}>{link.avatar}</div>
              <div className={styles.linkInfo}>
                <div className={styles.linkName}>{link.name}</div>
                <div className={styles.linkDescription}>{link.description}</div>
                <div className={styles.linkUrl}>{link.url}</div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>暂无友情链接</div>
      )}
    </>
  )
}