export { Layout }

import { Link } from '@/components/Link'
import '@/assets/css/app.css'
import lightMode from '@/assets/img/light.svg'
import styles from './Layout.module.scss'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['defalut-layout']}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li><Link href="/">Posts</Link></li>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/classfiy">Classfiy</Link></li>
          <li><Link href="/label">Label</Link></li>
          <li><Link href="/link">Link</Link></li>
        </ul>

      </nav>
      <div className={styles['tool-box']}>
        <button><img src={lightMode} alt="light mode" /></button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <p>© 2025 All rights reserved.</p>
        <p>Site has been running for 3 days.</p>
        <p>Theme sonic Powered by Supabase and cloudflare</p>
      </div>
      <div>
        <button>🚀 Go Top</button>
      </div>
    </footer>
  )
}