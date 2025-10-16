export { Layout }

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      {children}
    </div>
  )
}