import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, NavigationProvider, UIProvider, useAuth, useNavigation } from '@/contexts'
import { DashboardLayout } from '@/components/layout'
import { ProtectedRoute, RoleProtectedRoute, PublicRoute } from '@/components/routes'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import {
  LoginPage,
  DashboardPage,
  BookingPage,
  BookingAdminPage,
  ReportsPage,
  ReportsExportPage,
  SystemStatusPage,
  SystemLogsPage,
  SystemUsersPage,
  ServiceToolsPage,
  ForbiddenPage,
  NotFoundPage,
  HealthPage,
} from '@/pages'
import { ROUTES } from '@/config/constants'

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth()
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

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const defaultRoute = getDefaultRoute(user.role)
  return <Navigate to={defaultRoute} replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Error pages - accessible without auth */}
      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - all authenticated users */}
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

        {/* Booking */}
        <Route
          path={ROUTES.BOOKING}
          element={
            <RoleProtectedRoute roles={['admin', 'teacher', 'student', 'ziggy']}>
              <BookingPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BOOKING_ADMIN}
          element={
            <RoleProtectedRoute
              roles={['admin', 'teacher', 'ziggy']}
              permissions={['BOOKING_EDIT']}
            >
              <BookingAdminPage />
            </RoleProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path={ROUTES.REPORTS}
          element={
            <RoleProtectedRoute
              roles={['admin', 'teacher', 'ziggy']}
              permissions={['REPORTS_VIEW']}
            >
              <ReportsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REPORTS_EXPORT}
          element={
            <RoleProtectedRoute
              roles={['admin', 'ziggy']}
              permissions={['REPORTS_VIEW']}
            >
              <ReportsExportPage />
            </RoleProtectedRoute>
          }
        />

        {/* System */}
        <Route
          path={ROUTES.SYSTEM_STATUS}
          element={
            <RoleProtectedRoute
              roles={['admin', 'ziggy']}
              permissions={['SYSTEM_VIEW']}
            >
              <SystemStatusPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SYSTEM_LOGS}
          element={
            <RoleProtectedRoute
              roles={['admin', 'ziggy']}
              permissions={['SYSTEM_VIEW']}
            >
              <SystemLogsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SYSTEM_USERS}
          element={
            <RoleProtectedRoute
              roles={['admin', 'ziggy']}
              permissions={['USERS_MANAGE']}
            >
              <SystemUsersPage />
            </RoleProtectedRoute>
          }
        />

        {/* Service tools - ziggy only */}
        <Route
          path={ROUTES.SERVICE_TOOLS}
          element={
            <RoleProtectedRoute roles={['ziggy']}>
              <ServiceToolsPage />
            </RoleProtectedRoute>
          }
        />

        {/* Health check */}
        <Route
          path={ROUTES.HEALTH}
          element={
            <RoleProtectedRoute roles={['admin', 'ziggy']}>
              <HealthPage />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <UIProvider>
              <AppRoutes />
            </UIProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
