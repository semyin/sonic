export { Page }

import '@/assets/css/globals.css'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { navigate } from 'vike/client/router'

function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.msg || '登录失败')
        return
      }

      navigate('/admin')
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 rounded mb-3">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Sonic</h1>
          <p className="text-xs text-gray-600">登录到管理后台</p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          © 2024 Sonic
        </p>
      </div>
    </div>
  )
}
