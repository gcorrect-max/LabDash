import { Download } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function ReportsExportPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Download size={32} className={styles.icon} />
        <h1 className={styles.title}>Eksport raportów</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Eksportuj raporty do różnych formatów (PDF, CSV, Excel).
        </p>
      </div>
    </div>
  )
}
