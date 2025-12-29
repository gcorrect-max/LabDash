import { Navigate } from 'react-router-dom'
import { useAuth, useNavigation } from '@/contexts'
import { ROUTES } from '@/config/constants'

interface PublicRouteProps {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading, user, returnUrl } = useAuth()
  const { getDefaultRoute } = useNavigation()

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

  if (isAuthenticated && user) {
    const redirectTo = returnUrl || getDefaultRoute(user.role) || ROUTES.DASHBOARD
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
