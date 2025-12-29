import { Menu, LogOut, User } from 'lucide-react'
import { useAuth, useNavigation, useUI } from '@/contexts'
import styles from './Header.module.css'

export function Header() {
  const { user, logout } = useAuth()
  const { source, error } = useNavigation()
  const { openSidebar } = useUI()

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    teacher: 'Nauczyciel',
    student: 'Student',
    ziggy: 'Serwis',
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={`${styles.menuButton} btn btn-ghost`}
          onClick={openSidebar}
          aria-label="Otwórz menu"
        >
          <Menu size={24} />
        </button>
        <div className={styles.logo}>
          <span className={styles.logoText}>LabDash</span>
        </div>
      </div>

      {source === 'fallback' && error && (
        <div className={styles.fallbackBanner}>
          <span>Menu awaryjne aktywne</span>
        </div>
      )}

      <div className={styles.right}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{roleLabels[user.role] || user.role}</span>
            </div>
          </div>
        )}

        <button
          className={`${styles.logoutButton} btn btn-ghost`}
          onClick={logout}
          aria-label="Wyloguj"
        >
          <LogOut size={20} />
          <span className={styles.logoutText}>Wyloguj</span>
        </button>
      </div>
    </header>
  )
}
