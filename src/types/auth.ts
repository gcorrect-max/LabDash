export type UserRole = 'admin' | 'teacher' | 'student' | 'ziggy'

export type Permission =
  | 'DASHBOARD_VIEW'
  | 'BOOKING_VIEW'
  | 'BOOKING_EDIT'
  | 'SYSTEM_VIEW'
  | 'SYSTEM_ADMIN'
  | 'REPORTS_VIEW'
  | 'USERS_MANAGE'

export interface UserProfile {
  id: string
  name: string
  email?: string
  role: UserRole
  permissions?: Permission[]
  featureFlags?: Record<string, boolean>
  tokenExpiresAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  tokens: AuthTokens
  user?: UserProfile
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  tokens: AuthTokens | null
  loading: boolean
  error: string | null
  returnUrl: string | null
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  setReturnUrl: (url: string | null) => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
}
