export { Layout }

import '@/assets/css/app.css'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="defalut">
      {children}
    </div>
  )
}