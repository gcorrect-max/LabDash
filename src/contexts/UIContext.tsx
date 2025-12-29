import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

interface UIState {
  sidebarCollapsed: boolean
  sidebarOpen: boolean
}

interface UIContextValue extends UIState {
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openSidebar: () => void
  closeSidebar: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

interface UIProviderProps {
  children: ReactNode
}

export function UIProvider({ children }: UIProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => !prev)
  }, [])

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed)
  }, [])

  const openSidebar = useCallback(() => {
    setSidebarOpen(true)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const value: UIContextValue = useMemo(
    () => ({
      sidebarCollapsed,
      sidebarOpen,
      toggleSidebar,
      setSidebarCollapsed,
      openSidebar,
      closeSidebar,
    }),
    [sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarCollapsed, openSidebar, closeSidebar]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
