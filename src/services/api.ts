import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants'
import type { LoginCredentials, LoginResponse, UserProfile } from '@/types'
import { mockAuthApi, mockUsersApi, mockBookingsApi } from './mockApi'

// Ustaw na true aby używać mock API zamiast rzeczywistego
const USE_MOCK_API = true

class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.code
    )
  }

  return response
}

export const authApi = USE_MOCK_API ? mockAuthApi : {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return response.json()
  },

  async me(): Promise<UserProfile> {
    const response = await fetchWithAuth('/auth/me')
    return response.json()
  },

  async logout(): Promise<void> {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' })
    } catch {
      // Ignore logout errors
    }
  },
}

export interface UserManagement {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'ziggy'
  group?: string
  createdAt?: string
  lastLogin?: string
  isActive?: boolean
}

export const usersApi = USE_MOCK_API ? mockUsersApi : {
  async getAll(): Promise<UserManagement[]> {
    const response = await fetchWithAuth('/users')
    return response.json()
  },

  async getById(id: string): Promise<UserManagement> {
    const response = await fetchWithAuth(`/users/${id}`)
    return response.json()
  },

  async create(data: Omit<UserManagement, 'id' | 'createdAt'>): Promise<UserManagement> {
    const response = await fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(
    id: string,
    data: Partial<Omit<UserManagement, 'id' | 'createdAt'>>
  ): Promise<UserManagement> {
    const response = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string): Promise<void> {
    await fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await fetchWithAuth('/users/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    })
  },
}

export interface BookingPayload {
  title: string
  start: string
  end: string
  description?: string
  attendees?: string[]
}

export interface BookingEvent {
  id: string
  title: string
  start: string
  end: string
  description?: string
  attendees?: string[]
}

export const bookingsApi = USE_MOCK_API
  ? mockBookingsApi
  : {
      async getAll(): Promise<BookingEvent[]> {
        const response = await fetchWithAuth('/bookings')
        return response.json()
      },

      async getById(id: string): Promise<BookingEvent> {
        const response = await fetchWithAuth(`/bookings/${id}`)
        return response.json()
      },

      async create(data: BookingPayload): Promise<BookingEvent> {
        const response = await fetchWithAuth('/bookings', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },

      async update(id: string, data: Partial<BookingPayload>): Promise<BookingEvent> {
        const response = await fetchWithAuth(`/bookings/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
        return response.json()
      },

      async delete(id: string): Promise<void> {
        await fetchWithAuth(`/bookings/${id}`, { method: 'DELETE' })
      },
    }

export { ApiError }
