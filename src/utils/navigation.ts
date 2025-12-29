import { APP_VERSION, DEFAULT_FEATURE_FLAGS } from '@/config/constants'
import type {
  NavItem,
  NavLinkItem,
  NavigationConfig,
  UserProfile,
  UserRole,
  Permission,
} from '@/types'

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}

export function isVersionCompatible(config: NavigationConfig): boolean {
  if (!config.minAppVersion) return true
  return compareVersions(APP_VERSION, config.minAppVersion) >= 0
}

export function getMergedFeatureFlags(
  user: UserProfile | null,
  config: NavigationConfig | null
): Record<string, boolean> {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...(config?.featureFlags || {}),
    ...(user?.featureFlags || {}),
  }
}

function isItemAllowed(
  item: NavItem,
  userRole: UserRole,
  userPermissions: Permission[],
  featureFlags: Record<string, boolean>
): boolean {
  if ('hidden' in item && item.hidden) {
    return false
  }

  if ('featureFlag' in item && item.featureFlag) {
    if (!featureFlags[item.featureFlag]) {
      return false
    }
  }

  if ('rolesAllowed' in item && item.rolesAllowed && item.rolesAllowed.length > 0) {
    if (!item.rolesAllowed.includes(userRole)) {
      return false
    }
  }

  if ('permissionsRequired' in item && item.permissionsRequired) {
    const hasAllPermissions = item.permissionsRequired.every((p) =>
      userPermissions.includes(p)
    )
    if (!hasAllPermissions) {
      return false
    }
  }

  return true
}

function filterNavItem(
  item: NavItem,
  userRole: UserRole,
  userPermissions: Permission[],
  featureFlags: Record<string, boolean>
): NavItem | null {
  if (!isItemAllowed(item, userRole, userPermissions, featureFlags)) {
    return null
  }

  if (item.type === 'group') {
    const filteredChildren = item.children
      .map((child) => filterNavItem(child, userRole, userPermissions, featureFlags))
      .filter((child): child is NavItem => child !== null)

    if (filteredChildren.length === 0) {
      return null
    }

    return {
      ...item,
      children: filteredChildren,
    }
  }

  return item
}

export function filterNavigation(
  items: NavItem[],
  user: UserProfile | null,
  featureFlags: Record<string, boolean>
): NavItem[] {
  if (!user) return []

  const userRole = user.role
  const userPermissions = user.permissions || []

  const filtered = items
    .map((item) => filterNavItem(item, userRole, userPermissions, featureFlags))
    .filter((item): item is NavItem => item !== null)

  return sortNavItems(filtered)
}

function sortNavItems(items: NavItem[]): NavItem[] {
  return [...items]
    .sort((a, b) => (a.order ?? 10000) - (b.order ?? 10000))
    .map((item) => {
      if (item.type === 'group') {
        return {
          ...item,
          children: sortNavItems(item.children),
        }
      }
      return item
    })
}

export function getFirstAccessibleRoute(items: NavItem[]): string | null {
  for (const item of items) {
    if (item.type === 'link') {
      return item.path
    }
    if (item.type === 'group') {
      const childRoute = getFirstAccessibleRoute(item.children)
      if (childRoute) return childRoute
    }
  }
  return null
}

export function findLinkByPath(
  items: NavItem[],
  path: string
): NavLinkItem | null {
  for (const item of items) {
    if (item.type === 'link' && item.path === path) {
      return item
    }
    if (item.type === 'group') {
      const found = findLinkByPath(item.children, path)
      if (found) return found
    }
  }
  return null
}

export function isPathAccessible(items: NavItem[], path: string): boolean {
  return findLinkByPath(items, path) !== null
}

export function validateNavigationConfig(config: unknown): config is NavigationConfig {
  if (!config || typeof config !== 'object') return false

  const c = config as Record<string, unknown>

  if (typeof c.version !== 'string') return false
  if (!c.defaultRouteByRole || typeof c.defaultRouteByRole !== 'object') return false
  if (!Array.isArray(c.items)) return false

  const ids = new Set<string>()
  function collectIds(items: unknown[]): boolean {
    for (const item of items) {
      if (!item || typeof item !== 'object') return false
      const i = item as Record<string, unknown>
      if (typeof i.id !== 'string') return false
      if (ids.has(i.id)) return false
      ids.add(i.id)
      if (i.type === 'group' && Array.isArray(i.children)) {
        if (!collectIds(i.children)) return false
      }
    }
    return true
  }

  return collectIds(c.items as unknown[])
}
