import { apiFetch } from './api'
import type { AuthUser } from '../stores/auth.store'

export type LoginBody = { email: string; password: string }
export type RegisterBody = { email: string; password: string; name?: string }

export type LoginResponse = { accessToken: string; user: AuthUser }
export type MeResponse = { user: AuthUser | null }
export type RefreshResponse = { accessToken: string } | null

export function login(body: LoginBody) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function register(body: RegisterBody) {
  return apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function me(accessToken: string) {
  return apiFetch<MeResponse>('/api/auth/me', {
    method: 'GET',
    accessToken,
  })
}

export function refresh() {
  return apiFetch<RefreshResponse>('/api/auth/refresh', {
    method: 'POST',
  })
}

export function logout() {
  return apiFetch<{ ok: boolean }>('/api/auth/logout', {
    method: 'POST',
  })
}
