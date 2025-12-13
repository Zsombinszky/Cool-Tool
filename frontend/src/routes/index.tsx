import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-bold">Hello 👋</h1>
      <p className="text-muted-foreground">
        Mini kurzusok + interjú felkészítők junioroknak.
      </p>

      {user ? (
        <Link to="/dashboard" className="underline">
          Go to Dashboard →
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link to="/login" className="underline">
            Login
          </Link>
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      )}
    </div>
  )
}
