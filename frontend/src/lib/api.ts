const API_BASE = import.meta.env.VITE_API_BASE_URL as string

type ApiOptions = RequestInit & {
  accessToken?: string | null
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // <<< refresh cookie miatt KELL
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    const msg = data?.message ?? `Request failed (${res.status})`
    throw new ApiError(res.status, msg)
  }

  return data as T
}
