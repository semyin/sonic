export { Layout }

import '@/assets/css/admin.css'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      {children}
    </div>
  )
}