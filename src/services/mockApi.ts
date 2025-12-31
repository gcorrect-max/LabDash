import type { LoginCredentials, LoginResponse, UserProfile, UserRole } from '@/types'

const MOCK_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'admin@example.com': {
    password: 'admin123',
    profile: {
      id: '1',
      name: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
      permissions: [
        'DASHBOARD_VIEW',
        'BOOKING_VIEW',
        'BOOKING_EDIT',
        'SYSTEM_VIEW',
        'SYSTEM_ADMIN',
        'REPORTS_VIEW',
        'USERS_MANAGE',
      ],
      featureFlags: {
        bookingEnabled: true,
        reportsEnabled: true,
        systemEnabled: true,
        serviceToolsEnabled: true,
      },
    },
  },
  'teacher@example.com': {
    password: 'teacher123',
    profile: {
      id: '2',
      name: 'Jan Kowalski',
      email: 'teacher@example.com',
      role: 'teacher',
      permissions: ['DASHBOARD_VIEW', 'BOOKING_VIEW', 'BOOKING_EDIT', 'REPORTS_VIEW'],
      featureFlags: {
        bookingEnabled: true,
        reportsEnabled: true,
        systemEnabled: false,
        serviceToolsEnabled: false,
      },
    },
  },
  'student@example.com': {
    password: 'student123',
    profile: {
      id: '3',
      name: 'Anna Nowak',
      email: 'student@example.com',
      role: 'student',
      permissions: ['DASHBOARD_VIEW', 'BOOKING_VIEW'],
      featureFlags: {
        bookingEnabled: true,
        reportsEnabled: false,
        systemEnabled: false,
        serviceToolsEnabled: false,
      },
    },
  },
  'ziggy@example.com': {
    password: 'ziggy123',
    profile: {
      id: '4',
      name: 'Ziggy Service',
      email: 'ziggy@example.com',
      role: 'ziggy',
      permissions: [
        'DASHBOARD_VIEW',
        'BOOKING_VIEW',
        'BOOKING_EDIT',
        'SYSTEM_VIEW',
        'SYSTEM_ADMIN',
        'REPORTS_VIEW',
        'USERS_MANAGE',
      ],
      featureFlags: {
        bookingEnabled: true,
        reportsEnabled: true,
        systemEnabled: true,
        serviceToolsEnabled: true,
      },
    },
  },
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let currentUser: UserProfile | null = null

export const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(500)

    const user = MOCK_USERS[credentials.email]

    if (!user || user.password !== credentials.password) {
      throw new Error('Nieprawidłowy email lub hasło')
    }

    currentUser = user.profile

    return {
      tokens: {
        accessToken: `mock-token-${user.profile.id}-${Date.now()}`,
        refreshToken: `mock-refresh-${user.profile.id}-${Date.now()}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
      user: user.profile,
    }
  },

  async me(): Promise<UserProfile> {
    await delay(200)

    if (!currentUser) {
      throw new Error('Not authenticated')
    }

    return currentUser
  },

  async logout(): Promise<void> {
    await delay(200)
    currentUser = null
  },

  setCurrentUser(profile: UserProfile | null): void {
    currentUser = profile
  },
}

export function getMockUserByRole(role: UserRole): UserProfile | undefined {
  return Object.values(MOCK_USERS).find((u) => u.profile.role === role)?.profile
}

// Mock Users Management Database
let mockUsersDB: Array<{
  id: string
  name: string
  email: string
  role: UserRole
  group?: string
  createdAt: string
  lastLogin?: string
  isActive: boolean
}> = [
  {
    id: '1',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-15',
    lastLogin: '2025-12-31',
    isActive: true,
  },
  {
    id: '2',
    name: 'Jan Kowalski',
    email: 'teacher@example.com',
    role: 'teacher',
    createdAt: '2024-02-01',
    lastLogin: '2025-12-30',
    isActive: true,
  },
  {
    id: '3',
    name: 'Anna Nowak',
    email: 'student@example.com',
    role: 'student',
    group: 'Grupa A',
    createdAt: '2024-03-10',
    lastLogin: '2025-12-25',
    isActive: true,
  },
]

export const mockUsersApi = {
  async getAll() {
    await delay(300)
    return mockUsersDB
  },

  async getById(id: string) {
    await delay(200)
    const user = mockUsersDB.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    return user
  },

  async create(data: {
    name: string
    email: string
    role: UserRole
    group?: string
    isActive?: boolean
  }) {
    await delay(300)

    // Sprawdzenie duplikatu email
    if (mockUsersDB.some((u) => u.email === data.email)) {
      const error = new Error('Email already exists') as any
      error.response = { status: 409, data: { message: 'Ten adres email jest już zarejestrowany w systemie' } }
      throw error
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      group: data.group,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: data.isActive !== false,
    }

    mockUsersDB.push(newUser)
    return newUser
  },

  async update(id: string, data: Partial<any>) {
    await delay(300)

    const idx = mockUsersDB.findIndex((u) => u.id === id)
    if (idx === -1) {
      const error = new Error('User not found') as any
      error.response = { status: 404, data: { message: 'Użytkownik nie został znaleziony' } }
      throw error
    }

    // Jeśli zmienia email, sprawdzić duplikat
    if (data.email && data.email !== mockUsersDB[idx].email) {
      if (mockUsersDB.some((u) => u.email === data.email)) {
        const error = new Error('Email already exists') as any
        error.response = { status: 409, data: { message: 'Ten adres email jest już zarejestrowany w systemie' } }
        throw error
      }
    }

    mockUsersDB[idx] = { ...mockUsersDB[idx], ...data, lastLogin: mockUsersDB[idx].lastLogin }
    return mockUsersDB[idx]
  },

  async delete(id: string) {
    await delay(300)

    const idx = mockUsersDB.findIndex((u) => u.id === id)
    if (idx === -1) {
      const error = new Error('User not found') as any
      error.response = { status: 404, data: { message: 'Użytkownik nie został znaleziony' } }
      throw error
    }

    mockUsersDB.splice(idx, 1)
  },

  async bulkDelete(ids: string[]) {
    await delay(300)
    mockUsersDB = mockUsersDB.filter((u) => !ids.includes(u.id))
  },
}

// Mock Bookings Database + API
let mockBookingsDB: Array<{
  id: string
  title: string
  start: string
  end: string
  description?: string
  attendees?: string[]
}> = [
  {
    id: 'b-1',
    title: 'Spotkanie zespołu',
    start: new Date().toISOString(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    description: 'Cotygodniowe spotkanie statusowe',
    attendees: ['jan@example.com', 'anna@example.com'],
  },
]

export const mockBookingsApi = {
  async getAll() {
    await delay(250)
    // return copies
    return mockBookingsDB.map((b) => ({ ...b }))
  },

  async getById(id: string) {
    await delay(150)
    const ev = mockBookingsDB.find((b) => b.id === id)
    if (!ev) {
      const err = new Error('Not found') as any
      err.response = { status: 404 }
      throw err
    }
    return { ...ev }
  },

  async create(data: { title: string; start: string; end: string; description?: string; attendees?: string[] }) {
    await delay(200)
    const newEv = { id: `b-${Date.now()}`, ...data }
    mockBookingsDB.push(newEv)
    return { ...newEv }
  },

  async update(id: string, data: Partial<any>) {
    await delay(200)
    const idx = mockBookingsDB.findIndex((b) => b.id === id)
    if (idx === -1) {
      const err = new Error('Not found') as any
      err.response = { status: 404 }
      throw err
    }
    mockBookingsDB[idx] = { ...mockBookingsDB[idx], ...data }
    return { ...mockBookingsDB[idx] }
  },

  async delete(id: string) {
    await delay(150)
    const idx = mockBookingsDB.findIndex((b) => b.id === id)
    if (idx === -1) {
      const err = new Error('Not found') as any
      err.response = { status: 404 }
      throw err
    }
    mockBookingsDB.splice(idx, 1)
  },
}
