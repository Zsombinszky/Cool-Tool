import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '@/lib/authApi'
import { useAuthStore } from '@/stores/auth.store'
import { ApiError } from '@/lib/api'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <div className="rounded-md border p-3 text-sm">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm">Email</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Password</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button
        className="w-full rounded-md border px-3 py-2"
        disabled={loading}
        onClick={async () => {
          setError(null)
          setLoading(true)
          try {
            const res = await login({ email, password })
            setAuth(res)
            await router.navigate({ to: '/dashboard' })
          } catch (e: unknown) {
            if (e instanceof ApiError) {
              setError(e.message)
            } else if (e instanceof Error) {
              setError(e.message)
            } else {
              setError('Login failed')
            }
          } finally {
            setLoading(false)
          }
        }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </div>
  )
}
