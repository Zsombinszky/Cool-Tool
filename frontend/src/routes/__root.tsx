import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import type { RouterContext } from '@/router'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect, useState } from 'react'
import { bootstrapAuth } from '@/lib/authBootstrap'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  const [booting, setBooting] = useState(true)

  useEffect(() => {
    ;(async () => {
      await bootstrapAuth()
      setBooting(false)
    })()
  }, [])

  if (booting) {
    return (
      <>
        <div className="min-h-svh">
          <header className="border-b">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
              <div className="text-lg font-semibold">Cool Tool</div>
              <div className="text-sm text-muted-foreground">
                Loading session...
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-5xl p-4">
            <div className="rounded-md border p-4 text-sm">Bootstrapping…</div>
          </main>
        </div>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <div className="min-h-svh">
        <header className="border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
            <Link to="/" className="text-lg font-semibold">
              Cool Tool
            </Link>

            <nav className="flex items-center gap-3">
              <Link to="/" className="[&.active]:underline">
                Home
              </Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="[&.active]:underline">
                    Dashboard
                  </Link>
                  <button
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={async () => {
                      // frontend oldalon csak store clear + redirect
                      clearAuth()
                      await router.navigate({ to: '/login' })
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="[&.active]:underline">
                    Login
                  </Link>
                  <Link to="/register" className="[&.active]:underline">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </>
  )
}
