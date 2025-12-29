import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import { ROUTES } from '@/config/constants'
import type { UserRole, Permission } from '@/types'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
  permissions?: Permission[]
}

export function RoleProtectedRoute({
  children,
  roles,
  permissions,
}: RoleProtectedRouteProps) {
  const { user, hasRole, hasPermission } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const hasRequiredRole = !roles || roles.length === 0 || hasRole(roles)

  const hasRequiredPermissions =
    !permissions ||
    permissions.length === 0 ||
    permissions.every((p) => hasPermission(p))

  if (!hasRequiredRole || !hasRequiredPermissions) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return <>{children}</>
}
