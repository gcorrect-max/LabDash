import { Calendar } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function BookingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calendar size={32} className={styles.icon} />
        <h1 className={styles.title}>Kalendarz rezerwacji</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Tutaj będzie wyświetlany kalendarz rezerwacji.
        </p>
      </div>
    </div>
  )
}
