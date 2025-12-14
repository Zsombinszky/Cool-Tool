import { create } from 'zustand'

export type AuthUser = {
  id: string
  email: string
  name?: string | null
  role: string
}

type AuthState = {
  accessToken: string | null
  user: AuthUser | null

  hydrated: boolean
  setHydrated: (v: boolean) => void

  setAuth: (payload: { accessToken: string; user: AuthUser }) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  hydrated: false,
  setHydrated: (hydrated) => set({ hydrated }),

  setAuth: ({ accessToken, user }) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null, user: null }),
}))
