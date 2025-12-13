import { refresh, me } from '@/lib/authApi'
import { useAuthStore } from '@/stores/auth.store'

export async function bootstrapAuth() {
  const { setAccessToken, setAuth, clearAuth } = useAuthStore.getState()

  try {
    // 1) próbálunk refresh-elni cookie alapján
    const r = await refresh()
    setAccessToken(r.accessToken)

    // 2) me az új access tokennel
    const m = await me(r.accessToken)

    if (!m.user) {
      clearAuth()
      return
    }

    setAuth({ accessToken: r.accessToken, user: m.user })
  } catch {
    // ha nincs cookie / lejárt / stb. -> "vendég" állapot
    clearAuth()
  }
}
