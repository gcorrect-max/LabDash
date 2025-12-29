import { Settings } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function BookingAdminPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Settings size={32} className={styles.icon} />
        <h1 className={styles.title}>Zarządzanie rezerwacjami</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Panel administracyjny rezerwacji. Dostępny dla administratorów i nauczycieli.
        </p>
      </div>
    </div>
  )
}
