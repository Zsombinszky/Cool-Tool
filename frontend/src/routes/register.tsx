import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { register } from '@/lib/authApi'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [name, setName] = useState('New User')
  const [email, setEmail] = useState('newuser@test.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>

      {error && <div className="rounded-md border p-3 text-sm">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm">Name</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

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
          autoComplete="new-password"
        />
      </div>

      <button
        className="w-full rounded-md border px-3 py-2"
        disabled={loading}
        onClick={async () => {
          setError(null)
          setLoading(true)
          try {
            const res = await register({ name, email, password })
            setAuth(res)
            await router.navigate({ to: '/dashboard' })
          } catch (e: any) {
            setError(e?.message ?? 'Register failed')
          } finally {
            setLoading(false)
          }
        }}
      >
        {loading ? 'Creating...' : 'Create account'}
      </button>
    </div>
  )
}
