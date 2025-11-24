export { Layout }

import { Sidebar } from "@/components/SideBar"
import { Navbar } from "@/components/Navbar"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar currentPath={'/'} />
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}
