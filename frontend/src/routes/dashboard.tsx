import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'
import { bootstrapAuth } from '@/lib/authBootstrap'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { hydrated, user } = useAuthStore.getState()

    // ha még nem futott le a bootstrap, futtassuk le itt
    if (!hydrated) {
      await bootstrapAuth()
    }

    // bootstrap után újra olvasunk
    const s = useAuthStore.getState()
    if (!s.user) throw redirect({ to: '/login' })
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
