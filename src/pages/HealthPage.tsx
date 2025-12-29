import { HeartPulse, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { APP_VERSION } from '@/config/constants'
import { useNavigation } from '@/contexts'
import styles from './HealthPage.module.css'

export function HealthPage() {
  const { rawConfig, source, error, lastLoadError } = useNavigation()

  const statusIcon = {
    remote: <CheckCircle size={20} className={styles.statusOk} />,
    fallback: error ? (
      <AlertCircle size={20} className={styles.statusWarning} />
    ) : (
      <CheckCircle size={20} className={styles.statusOk} />
    ),
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <HeartPulse size={32} className={styles.icon} />
        <h1 className={styles.title}>Health Check</h1>
      </div>

      <div className={styles.grid}>
        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Aplikacja</h2>
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>Wersja:</span>
              <span className={styles.value}>{APP_VERSION}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles.statusOk}`}>
                <CheckCircle size={16} />
                Działa
              </span>
            </div>
          </div>
        </div>

        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Nawigacja</h2>
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>Źródło:</span>
              <span className={styles.value}>
                {statusIcon[source]}
                {source === 'remote' ? 'Plik zdalny' : 'Menu awaryjne'}
              </span>
            </div>
            {rawConfig && (
              <>
                <div className={styles.row}>
                  <span className={styles.label}>Wersja configu:</span>
                  <span className={styles.value}>{rawConfig.version}</span>
                </div>
                {rawConfig.generatedAt && (
                  <div className={styles.row}>
                    <span className={styles.label}>Wygenerowano:</span>
                    <span className={styles.value}>
                      {new Date(rawConfig.generatedAt).toLocaleString('pl-PL')}
                    </span>
                  </div>
                )}
                {rawConfig.minAppVersion && (
                  <div className={styles.row}>
                    <span className={styles.label}>Min. wersja app:</span>
                    <span className={styles.value}>{rawConfig.minAppVersion}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {lastLoadError && (
          <div className={`card ${styles.card} ${styles.errorCard}`}>
            <h2 className={styles.cardTitle}>Ostatni błąd ładowania nawigacji</h2>
            <div className={styles.errorMessage}>
              <XCircle size={20} />
              <span>{lastLoadError}</span>
            </div>
          </div>
        )}

        <div className={`card ${styles.card}`}>
          <h2 className={styles.cardTitle}>Backend</h2>
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles.statusWarning}`}>
                <AlertCircle size={16} />
                Tryb demo (mock API)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
