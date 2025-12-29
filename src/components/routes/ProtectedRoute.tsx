import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts'
import { ROUTES } from '@/config/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, setReturnUrl } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Ładowanie...
      </div>
    )
  }

  if (!isAuthenticated) {
    setReturnUrl(location.pathname + location.search)
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
