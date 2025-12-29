import { FileText } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function SystemLogsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FileText size={32} className={styles.icon} />
        <h1 className={styles.title}>Logi systemowe</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Przeglądaj logi i zdarzenia systemowe.
        </p>
      </div>
    </div>
  )
}
