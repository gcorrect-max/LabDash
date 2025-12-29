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
