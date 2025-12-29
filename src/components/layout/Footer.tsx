import { APP_VERSION } from '@/config/constants'
import { useNavigation } from '@/contexts'
import styles from './Footer.module.css'

export function Footer() {
  const { source, rawConfig } = useNavigation()

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span>LabDash v{APP_VERSION}</span>
        {source === 'fallback' && (
          <span className={styles.fallbackIndicator}>(menu awaryjne)</span>
        )}
      </div>
      <div className={styles.right}>
        {rawConfig && (
          <span className={styles.configVersion}>
            Config v{rawConfig.version}
          </span>
        )}
      </div>
    </footer>
  )
}
