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
  setAuth: (payload: { accessToken: string; user: AuthUser }) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: ({ accessToken, user }) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null, user: null }),
}))
