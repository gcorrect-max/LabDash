export const APP_VERSION = '1.0.0'

export const API_BASE_URL = '/api/v1'

export const NAVIGATION_CONFIG_PATH = '/config/navigation.json'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'labdash_access_token',
  REFRESH_TOKEN: 'labdash_refresh_token',
  USER: 'labdash_user',
  RETURN_URL: 'labdash_return_url',
} as const

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  BOOKING: '/booking',
  BOOKING_ADMIN: '/booking/admin',
  REPORTS: '/reports',
  REPORTS_EXPORT: '/reports/export',
  RESULTS: '/results',
  SYSTEM_STATUS: '/system/status',
  SYSTEM_LOGS: '/system/logs',
  SYSTEM_USERS: '/system/users',
  SERVICE_TOOLS: '/service/tools',
  NAVIGATION_EDITOR: '/service/navigation-editor',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
  HEALTH: '/health',
} as const

export const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = {
  bookingEnabled: true,
  reportsEnabled: true,
  systemEnabled: true,
  serviceToolsEnabled: false,
}
