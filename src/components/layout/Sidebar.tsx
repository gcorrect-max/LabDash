import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { useNavigation, useUI } from '@/contexts'
import type { NavItem, NavGroupItem, NavLinkItem } from '@/types'
import styles from './Sidebar.module.css'

interface NavLinkComponentProps {
  item: NavLinkItem
  onClick?: () => void
}

function NavLinkComponent({ item, onClick }: NavLinkComponentProps) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.active : ''}`
      }
      end={item.exact}
      target={item.external ? item.target || '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      <Icon name={item.icon} size={20} className={styles.navIcon} />
      <span className={styles.navLabel}>{item.label}</span>
      {item.badge && (
        <span className={`badge badge-${item.badge.variant || 'info'}`}>
          {item.badge.text}
        </span>
      )}
    </NavLink>
  )
}

interface NavGroupComponentProps {
  item: NavGroupItem
  onItemClick?: () => void
}

function NavGroupComponent({ item, onItemClick }: NavGroupComponentProps) {
  const [isOpen, setIsOpen] = useState(!item.collapseByDefault)
  const location = useLocation()

  const hasActiveChild = item.children.some(
    (child) => child.type === 'link' && location.pathname.startsWith(child.path)
  )

  return (
    <div className={styles.navGroup}>
      <button
        className={`${styles.navGroupHeader} ${hasActiveChild ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Icon name={item.icon} size={20} className={styles.navIcon} />
        <span className={styles.navLabel}>{item.label}</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>
      {isOpen && (
        <div className={styles.navGroupChildren}>
          {item.children.map((child) => (
            <NavItemComponent key={child.id} item={child} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  )
}

interface NavItemComponentProps {
  item: NavItem
  onItemClick?: () => void
}

function NavItemComponent({ item, onItemClick }: NavItemComponentProps) {
  if (item.type === 'link') {
    return <NavLinkComponent item={item} onClick={onItemClick} />
  }

  if (item.type === 'group') {
    return <NavGroupComponent item={item} onItemClick={onItemClick} />
  }

  if (item.type === 'divider') {
    return <div className={styles.divider} />
  }

  return null
}

export function Sidebar() {
  const { filteredItems, loading } = useNavigation()
  const { sidebarOpen, closeSidebar } = useUI()

  return (
    <>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}
        aria-label="Nawigacja główna"
      >
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>Menu</span>
          <button
            className="btn btn-ghost"
            onClick={closeSidebar}
            aria-label="Zamknij menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {loading ? (
            <div className={styles.loading}>Ładowanie menu...</div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.empty}>Brak dostępnych pozycji menu</div>
          ) : (
            filteredItems.map((item) => (
              <NavItemComponent key={item.id} item={item} onItemClick={closeSidebar} />
            ))
          )}
        </nav>
      </aside>
    </>
  )
}
