import { useAuth } from '@/contexts'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { user } = useAuth()

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    teacher: 'Nauczyciel',
    student: 'Student',
    ziggy: 'Serwis',
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Witaj, {user?.name}! ({roleLabels[user?.role || ''] || user?.role})
        </p>
      </div>

      <div className={styles.grid}>
        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Statystyki</h2>
          <p className={styles.cardValue}>-</p>
          <p className={styles.cardLabel}>Dane niedostępne</p>
        </div>

        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Rezerwacje</h2>
          <p className={styles.cardValue}>-</p>
          <p className={styles.cardLabel}>Brak rezerwacji</p>
        </div>

        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Powiadomienia</h2>
          <p className={styles.cardValue}>0</p>
          <p className={styles.cardLabel}>Nowych powiadomień</p>
        </div>
      </div>

      <div className={`card ${styles.recentActivity}`}>
        <h2 className={styles.sectionTitle}>Ostatnia aktywność</h2>
        <p className={styles.emptyState}>Brak ostatniej aktywności do wyświetlenia</p>
      </div>
    </div>
  )
}
