import type { UserRole, Permission } from './auth'

export type BadgeVariant = 'info' | 'success' | 'warning' | 'danger'

export interface NavBadge {
  text: string
  variant?: BadgeVariant
}

export interface NavLinkItem {
  type: 'link'
  id: string
  label: string
  path: string
  icon?: string
  order?: number
  rolesAllowed?: UserRole[]
  permissionsRequired?: Permission[]
  featureFlag?: string
  badge?: NavBadge
  hidden?: boolean
  external?: boolean
  target?: '_blank' | '_self'
  exact?: boolean
}

export interface NavGroupItem {
  type: 'group'
  id: string
  label: string
  icon?: string
  order?: number
  rolesAllowed?: UserRole[]
  permissionsRequired?: Permission[]
  featureFlag?: string
  children: NavItem[]
  collapseByDefault?: boolean
}

export interface NavDividerItem {
  type: 'divider'
  id: string
  order?: number
  rolesAllowed?: UserRole[]
  featureFlag?: string
}

export type NavItem = NavLinkItem | NavGroupItem | NavDividerItem

export interface NavigationConfig {
  version: string
  generatedAt?: string
  defaultRouteByRole: Record<UserRole, string>
  items: NavItem[]
  featureFlags?: Record<string, boolean>
  minAppVersion?: string
}

export type NavigationSource = 'remote' | 'fallback'

export interface NavigationState {
  rawConfig: NavigationConfig | null
  filteredItems: NavItem[]
  loading: boolean
  error: string | null
  source: NavigationSource
  lastLoadError?: string
}

export type NavigationLogEvent =
  | 'NAV_LOAD_FAILED'
  | 'NAV_VERSION_INCOMPATIBLE'
  | 'NAV_FALLBACK_USED'
  | 'NAV_VALIDATION_ERROR'

export interface NavigationContextValue extends NavigationState {
  reload: () => Promise<void>
  getDefaultRoute: (role: string) => string
}
