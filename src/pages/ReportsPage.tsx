import { BarChart3 } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function ReportsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BarChart3 size={32} className={styles.icon} />
        <h1 className={styles.title}>Raporty</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Przeglądaj raporty i statystyki systemu.
        </p>
      </div>
    </div>
  )
}
