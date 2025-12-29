import { Wrench } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function ServiceToolsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Wrench size={32} className={styles.icon} />
        <h1 className={styles.title}>Narzędzia serwisowe</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Narzędzia serwisowe dostępne tylko dla uprzywilejowanych użytkowników.
        </p>
      </div>
    </div>
  )
}
