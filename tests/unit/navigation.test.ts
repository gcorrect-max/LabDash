import { describe, it, expect } from 'vitest'
import {
  filterNavigation,
  validateNavigationConfig,
  isVersionCompatible,
  getFirstAccessibleRoute,
  getMergedFeatureFlags,
} from '@/utils/navigation'
import type { NavItem, UserProfile, NavigationConfig } from '@/types'

describe('Navigation Utils', () => {
  const mockUser: UserProfile = {
    id: '1',
    name: 'Test User',
    role: 'admin',
    permissions: ['DASHBOARD_VIEW', 'BOOKING_VIEW', 'SYSTEM_VIEW'],
    featureFlags: { customFlag: true },
  }

  const mockNavItems: NavItem[] = [
    {
      type: 'link',
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      order: 1,
    },
    {
      type: 'link',
      id: 'admin-only',
      label: 'Admin Only',
      path: '/admin',
      rolesAllowed: ['admin'],
      order: 2,
    },
    {
      type: 'link',
      id: 'student-only',
      label: 'Student Only',
      path: '/student',
      rolesAllowed: ['student'],
      order: 3,
    },
    {
      type: 'group',
      id: 'system-group',
      label: 'System',
      rolesAllowed: ['admin'],
      order: 4,
      children: [
        {
          type: 'link',
          id: 'system-status',
          label: 'Status',
          path: '/system/status',
          order: 1,
        },
      ],
    },
    {
      type: 'link',
      id: 'feature-flag-item',
      label: 'Feature Item',
      path: '/feature',
      featureFlag: 'featureEnabled',
      order: 5,
    },
    {
      type: 'link',
      id: 'hidden-item',
      label: 'Hidden',
      path: '/hidden',
      hidden: true,
      order: 6,
    },
  ]

  describe('filterNavigation', () => {
    it('should return empty array for null user', () => {
      const result = filterNavigation(mockNavItems, null, {})
      expect(result).toEqual([])
    })

    it('should filter out items not allowed for role', () => {
      const result = filterNavigation(mockNavItems, mockUser, {})
      const ids = result.map((item) => item.id)

      expect(ids).toContain('dashboard')
      expect(ids).toContain('admin-only')
      expect(ids).not.toContain('student-only')
    })

    it('should filter out hidden items', () => {
      const result = filterNavigation(mockNavItems, mockUser, {})
      const ids = result.map((item) => item.id)

      expect(ids).not.toContain('hidden-item')
    })

    it('should filter items by feature flag', () => {
      const resultWithFlag = filterNavigation(mockNavItems, mockUser, {
        featureEnabled: true,
      })
      const resultWithoutFlag = filterNavigation(mockNavItems, mockUser, {
        featureEnabled: false,
      })

      expect(resultWithFlag.map((i) => i.id)).toContain('feature-flag-item')
      expect(resultWithoutFlag.map((i) => i.id)).not.toContain('feature-flag-item')
    })

    it('should filter group children and remove empty groups', () => {
      const studentUser: UserProfile = {
        id: '2',
        name: 'Student',
        role: 'student',
        permissions: [],
      }

      const result = filterNavigation(mockNavItems, studentUser, {})

      expect(result.map((i) => i.id)).not.toContain('system-group')
    })

    it('should sort items by order', () => {
      const result = filterNavigation(mockNavItems, mockUser, {})
      const orders = result.map((item) => item.order)

      for (let i = 1; i < orders.length; i++) {
        expect(orders[i]! >= orders[i - 1]!).toBe(true)
      }
    })
  })

  describe('validateNavigationConfig', () => {
    it('should validate a correct config', () => {
      const config: NavigationConfig = {
        version: '1.0.0',
        defaultRouteByRole: {
          admin: '/dashboard',
          teacher: '/dashboard',
          student: '/booking',
          ziggy: '/dashboard',
        },
        items: [
          { type: 'link', id: 'dash', label: 'Dashboard', path: '/dashboard' },
        ],
      }

      expect(validateNavigationConfig(config)).toBe(true)
    })

    it('should reject config without version', () => {
      const config = {
        defaultRouteByRole: {},
        items: [],
      }

      expect(validateNavigationConfig(config)).toBe(false)
    })

    it('should reject config with duplicate ids', () => {
      const config = {
        version: '1.0.0',
        defaultRouteByRole: {},
        items: [
          { type: 'link', id: 'same', label: 'A', path: '/a' },
          { type: 'link', id: 'same', label: 'B', path: '/b' },
        ],
      }

      expect(validateNavigationConfig(config)).toBe(false)
    })

    it('should reject null or undefined config', () => {
      expect(validateNavigationConfig(null)).toBe(false)
      expect(validateNavigationConfig(undefined)).toBe(false)
    })
  })

  describe('isVersionCompatible', () => {
    it('should return true if no minAppVersion specified', () => {
      const config: NavigationConfig = {
        version: '1.0.0',
        defaultRouteByRole: { admin: '/dashboard', teacher: '/dashboard', student: '/booking', ziggy: '/dashboard' },
        items: [],
      }

      expect(isVersionCompatible(config)).toBe(true)
    })

    it('should return true if app version meets requirement', () => {
      const config: NavigationConfig = {
        version: '1.0.0',
        minAppVersion: '1.0.0',
        defaultRouteByRole: { admin: '/dashboard', teacher: '/dashboard', student: '/booking', ziggy: '/dashboard' },
        items: [],
      }

      expect(isVersionCompatible(config)).toBe(true)
    })
  })

  describe('getFirstAccessibleRoute', () => {
    it('should return first link path', () => {
      const items: NavItem[] = [
        { type: 'link', id: 'first', label: 'First', path: '/first' },
        { type: 'link', id: 'second', label: 'Second', path: '/second' },
      ]

      expect(getFirstAccessibleRoute(items)).toBe('/first')
    })

    it('should return null for empty array', () => {
      expect(getFirstAccessibleRoute([])).toBe(null)
    })

    it('should find link inside group', () => {
      const items: NavItem[] = [
        { type: 'divider', id: 'div' },
        {
          type: 'group',
          id: 'group',
          label: 'Group',
          children: [
            { type: 'link', id: 'nested', label: 'Nested', path: '/nested' },
          ],
        },
      ]

      expect(getFirstAccessibleRoute(items)).toBe('/nested')
    })
  })

  describe('getMergedFeatureFlags', () => {
    it('should merge flags with correct priority', () => {
      const config: NavigationConfig = {
        version: '1.0.0',
        defaultRouteByRole: { admin: '/dashboard', teacher: '/dashboard', student: '/booking', ziggy: '/dashboard' },
        items: [],
        featureFlags: {
          configFlag: true,
          overrideFlag: false,
        },
      }

      const user: UserProfile = {
        id: '1',
        name: 'Test',
        role: 'admin',
        featureFlags: {
          userFlag: true,
          overrideFlag: true,
        },
      }

      const result = getMergedFeatureFlags(user, config)

      expect(result.configFlag).toBe(true)
      expect(result.userFlag).toBe(true)
      expect(result.overrideFlag).toBe(true) // User flags override config
    })
  })
})
