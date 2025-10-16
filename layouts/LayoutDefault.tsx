export { app }

function app({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      {children}
    </div>
  )
}