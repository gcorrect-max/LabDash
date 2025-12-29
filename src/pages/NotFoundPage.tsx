import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { useAuth, useNavigation } from '@/contexts'
import { ROUTES } from '@/config/constants'
import styles from './ErrorPage.module.css'

export function NotFoundPage() {
  const { user } = useAuth()
  const { getDefaultRoute } = useNavigation()

  const homeRoute = user ? getDefaultRoute(user.role) : ROUTES.LOGIN

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FileQuestion size={80} className={styles.icon} />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Strona nie znaleziona</h2>
        <p className={styles.message}>
          Strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link to={homeRoute} className="btn btn-primary">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  )
}
