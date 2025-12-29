import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { useAuth, useNavigation } from '@/contexts'
import { ROUTES } from '@/config/constants'
import styles from './ErrorPage.module.css'

export function ForbiddenPage() {
  const { user } = useAuth()
  const { getDefaultRoute } = useNavigation()

  const homeRoute = user ? getDefaultRoute(user.role) : ROUTES.LOGIN

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ShieldX size={80} className={styles.icon} />
        <h1 className={styles.code}>403</h1>
        <h2 className={styles.title}>Brak dostępu</h2>
        <p className={styles.message}>
          Nie masz uprawnień do wyświetlenia tej strony.
        </p>
        <Link to={homeRoute} className="btn btn-primary">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  )
}
