import { Activity } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function SystemStatusPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Activity size={32} className={styles.icon} />
        <h1 className={styles.title}>Status systemu</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Monitoruj status i wydajność systemu.
        </p>
      </div>
    </div>
  )
}
