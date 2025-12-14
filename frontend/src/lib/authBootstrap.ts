import { refresh, me } from '@/lib/authApi'
import { useAuthStore } from '@/stores/auth.store'

let bootstrapPromise: Promise<void> | null = null

function isAuthBootstrapError(e: unknown) {
  const msg = e instanceof Error ? e.message : ''
  return (
    msg === 'No refresh token' ||
    msg === 'Refresh failed' ||
    msg === 'Invalid refresh token' ||
    msg === 'Request failed (401)' ||
    msg === 'Request failed (404)'
  )
}

export function bootstrapAuth() {
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const { setAccessToken, setAuth, clearAuth, setHydrated } =
      useAuthStore.getState()

    try {
      const r = await refresh()
      if (!r?.accessToken) {
        clearAuth()
        return
      }
      setAccessToken(r.accessToken)

      const m = await me(r.accessToken)

      if (!m.user) {
        clearAuth()
        return
      }

      setAuth({ accessToken: r.accessToken, user: m.user })
    } catch (e) {
      clearAuth()
      if (!isAuthBootstrapError(e)) {
        console.error('bootstrapAuth unexpected error:', e)
      }
    } finally {
      setHydrated(true)
    }
  })().finally(() => {
    bootstrapPromise = null
  })

  return bootstrapPromise
}
