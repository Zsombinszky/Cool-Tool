import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user) throw redirect({ to: '/login' })
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, {user?.name ?? user?.email} 🎉
      </p>

      <div className="rounded-md border p-4 text-sm">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  )
}
