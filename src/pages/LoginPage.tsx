import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useAuth, useNavigation } from '@/contexts'
import { ROUTES } from '@/config/constants'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { login, loading, error, clearError, returnUrl, user } = useAuth()
  const { getDefaultRoute } = useNavigation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login({ email, password })
    } catch {
      // Error is handled in context
    }
  }

  if (user) {
    const redirectTo = returnUrl || getDefaultRoute(user.role) || ROUTES.DASHBOARD
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>LabDash</h1>
          <p className={styles.subtitle}>Zaloguj się do systemu</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className="alert alert-error">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Hasło
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className={styles.demoUsers}>
          <p className={styles.demoTitle}>Konta testowe:</p>
          <ul className={styles.demoList}>
            <li>admin@example.com / admin123</li>
            <li>teacher@example.com / teacher123</li>
            <li>student@example.com / student123</li>
            <li>ziggy@example.com / ziggy123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
