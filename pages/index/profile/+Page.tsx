export { Page };

import { useState } from 'react';
import styles from './profile.module.scss';

function Page() {
  const [profile] = useState({
    name: '森亦',
    bio: '全栈开发者 / 技术博主 / 开源爱好者',
    location: '中国 · 深圳',
    avatar: '👨‍💻',
    about: `你好，我是森亦！

我是一名热爱技术的全栈开发者，专注于 Web 开发和用户体验设计。
喜欢探索新技术，分享开发经验，致力于构建优雅且高效的应用。

在这个博客里，我会分享我的技术心得、项目经验和生活感悟。
希望我的文章能对你有所帮助！`,
    skills: [
      { name: 'JavaScript', category: '编程语言', proficiency: 90 },
      { name: 'TypeScript', category: '编程语言', proficiency: 85 },
      { name: 'React', category: '前端框架', proficiency: 90 },
      { name: 'Vue.js', category: '前端框架', proficiency: 80 },
      { name: 'Node.js', category: '后端技术', proficiency: 85 },
      { name: 'Next.js', category: '全栈框架', proficiency: 80 },
      { name: 'Tailwind CSS', category: 'CSS 框架', proficiency: 90 },
      { name: 'PostgreSQL', category: '数据库', proficiency: 75 }
    ],
    contacts: [
      { icon: '📧', label: 'Email', value: 'hello@semyin.com', link: 'mailto:hello@semyin.com' },
      { icon: '🐙', label: 'GitHub', value: 'github.com/semyin', link: 'https://github.com/semyin' },
      { icon: '🐦', label: 'Twitter', value: '@semyin', link: 'https://twitter.com/semyin' },
      { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/semyin', link: 'https://linkedin.com/in/semyin' }
    ]
  });

  return (
    <>
      <h1 className='page-h1'>关于我</h1>

      <div className={styles.profileContainer}>
        {/* 个人信息头部 */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{profile.avatar}</div>
          <div className={styles.headerInfo}>
            <div className={styles.name}>{profile.name}</div>
            <div className={styles.bio}>{profile.bio}</div>
            <div className={styles.location}>
              <span>📍</span>
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* 关于我 */}
        <section className={styles.section}>
          <h2 className='section-title'>关于我</h2>
          <div className={styles.aboutContent}>{profile.about}</div>
        </section>

        {/* 技能 */}
        <section className={styles.section}>
          <h2 className='section-title'>技能</h2>
          <div className={styles.skillsGrid}>
            {profile.skills.map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillCategory}>{skill.category}</div>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillProgress}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 联系方式 */}
        <section className={styles.section}>
          <h2 className='section-title'>联系方式</h2>
          <div className={styles.contactList}>
            {profile.contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <div className={styles.contactIcon}>{contact.icon}</div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactLabel}>{contact.label}</div>
                  <div className={styles.contactValue}>{contact.value}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}