import { Users } from 'lucide-react'
import styles from './PlaceholderPage.module.css'

export function SystemUsersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Users size={32} className={styles.icon} />
        <h1 className={styles.title}>Zarządzanie użytkownikami</h1>
      </div>
      <div className={`card ${styles.content}`}>
        <p className={styles.placeholder}>
          Zarządzaj kontami użytkowników i ich uprawnieniami.
        </p>
      </div>
    </div>
  )
}
