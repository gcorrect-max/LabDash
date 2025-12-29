import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/config/constants'
import { mockAuthApi } from '@/services/mockApi'
import type {
  AuthContextValue,
  AuthState,
  LoginCredentials,
  Permission,
  UserProfile,
  UserRole,
} from '@/types'

const AuthContext = createContext<AuthContextValue | null>(null)

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  loading: true,
  error: null,
  returnUrl: null,
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  const saveToStorage = useCallback((user: UserProfile, accessToken: string, refreshToken?: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }, [])

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
    const savedReturnUrl = localStorage.getItem(STORAGE_KEYS.RETURN_URL)

    if (!token) {
      setState((prev) => ({
        ...prev,
        loading: false,
        returnUrl: savedReturnUrl,
      }))
      return
    }

    try {
      let user: UserProfile

      if (savedUser) {
        user = JSON.parse(savedUser)
        mockAuthApi.setCurrentUser(user)
      } else {
        user = await mockAuthApi.me()
      }

      setState({
        isAuthenticated: true,
        user,
        tokens: {
          accessToken: token,
          refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || undefined,
        },
        loading: false,
        error: null,
        returnUrl: savedReturnUrl,
      })
    } catch {
      clearStorage()
      setState((prev) => ({
        ...prev,
        loading: false,
        returnUrl: savedReturnUrl,
      }))
    }
  }, [clearStorage])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await mockAuthApi.login(credentials)
        const user = response.user || (await mockAuthApi.me())

        saveToStorage(user, response.tokens.accessToken, response.tokens.refreshToken)

        if (state.returnUrl) {
          localStorage.removeItem(STORAGE_KEYS.RETURN_URL)
        }

        setState({
          isAuthenticated: true,
          user,
          tokens: response.tokens,
          loading: false,
          error: null,
          returnUrl: state.returnUrl,
        })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Wystąpił błąd logowania',
        }))
        throw error
      }
    },
    [saveToStorage, state.returnUrl]
  )

  const logout = useCallback(() => {
    mockAuthApi.logout()
    clearStorage()
    setState({
      ...initialState,
      loading: false,
    })
  }, [clearStorage])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const setReturnUrl = useCallback((url: string | null) => {
    if (url) {
      localStorage.setItem(STORAGE_KEYS.RETURN_URL, url)
    } else {
      localStorage.removeItem(STORAGE_KEYS.RETURN_URL)
    }
    setState((prev) => ({ ...prev, returnUrl: url }))
  }, [])

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.user?.permissions) return false
      return state.user.permissions.includes(permission)
    },
    [state.user]
  )

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!state.user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(state.user.role)
    },
    [state.user]
  )

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    clearError,
    setReturnUrl,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
