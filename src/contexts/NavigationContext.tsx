import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { NAVIGATION_CONFIG_PATH, ROUTES } from '@/config/constants'
import { fallbackNavigation } from '@/config/navigation.fallback'
import {
  filterNavigation,
  getMergedFeatureFlags,
  isVersionCompatible,
  validateNavigationConfig,
  getFirstAccessibleRoute,
} from '@/utils/navigation'
import { useAuth } from './AuthContext'
import type {
  NavigationConfig,
  NavigationContextValue,
  NavigationState,
  NavigationSource,
  UserRole,
} from '@/types'

const NavigationContext = createContext<NavigationContextValue | null>(null)

const initialState: NavigationState = {
  rawConfig: null,
  filteredItems: [],
  loading: true,
  error: null,
  source: 'fallback',
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<NavigationState>(initialState)

  const loadNavigation = useCallback(async (): Promise<{
    config: NavigationConfig
    source: NavigationSource
    error?: string
  }> => {
    try {
      const response = await fetch(NAVIGATION_CONFIG_PATH)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load navigation config`)
      }

      const data = await response.json()

      if (!validateNavigationConfig(data)) {
        throw new Error('Invalid navigation config schema')
      }

      if (!isVersionCompatible(data)) {
        throw new Error(
          `Navigation config requires app version ${data.minAppVersion} or higher`
        )
      }

      return { config: data, source: 'remote' }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error loading navigation'

      console.error('NAV_LOAD_FAILED:', errorMessage)
      console.warn('NAV_FALLBACK_USED: Using fallback navigation config')

      return {
        config: fallbackNavigation,
        source: 'fallback',
        error: errorMessage,
      }
    }
  }, [])

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const { config, source, error } = await loadNavigation()

    const featureFlags = getMergedFeatureFlags(user, config)
    const filteredItems = filterNavigation(config.items, user, featureFlags)

    setState({
      rawConfig: config,
      filteredItems,
      loading: false,
      error: source === 'fallback' ? error || null : null,
      source,
      lastLoadError: error,
    })
  }, [loadNavigation, user])

  useEffect(() => {
    if (isAuthenticated && user) {
      reload()
    } else {
      setState(initialState)
    }
  }, [isAuthenticated, user, reload])

  const getDefaultRoute = useCallback(
    (role: string): string => {
      if (!state.rawConfig) {
        return fallbackNavigation.defaultRouteByRole[role as UserRole] || ROUTES.DASHBOARD
      }

      const configuredRoute = state.rawConfig.defaultRouteByRole[role as UserRole]
      if (configuredRoute) return configuredRoute

      const firstRoute = getFirstAccessibleRoute(state.filteredItems)
      if (firstRoute) return firstRoute

      return ROUTES.DASHBOARD
    },
    [state.rawConfig, state.filteredItems]
  )

  const value: NavigationContextValue = useMemo(
    () => ({
      ...state,
      reload,
      getDefaultRoute,
    }),
    [state, reload, getDefaultRoute]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
