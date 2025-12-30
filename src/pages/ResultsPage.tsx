import { useState, useEffect } from 'react'
import { List, Eye, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import styles from './ResultsPage.module.css'

// Typ danych dla wyniku
interface Result {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  score: number
  date: string
  details: {
    department: string
    position: string
    notes: string
    createdAt: string
    updatedAt: string
  }
}

// Komponent szczegółów wiersza
interface ResultDetailsProps {
  result: Result
  onClose: () => void
}

function ResultDetails({ result, onClose }: ResultDetailsProps) {
  return (
    <div className={styles.detailsOverlay} onClick={onClose}>
      <div className={styles.detailsPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detailsHeader}>
          <h3>Szczegóły: {result.name}</h3>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Zamknij">
            <X size={20} />
          </button>
        </div>

        <div className={styles.detailsContent}>
          <div className={styles.detailsSection}>
            <h4>Informacje podstawowe</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID:</span>
                <span className={styles.detailValue}>{result.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Imię i nazwisko:</span>
                <span className={styles.detailValue}>{result.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{result.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`badge badge-${getStatusVariant(result.status)}`}>
                  {getStatusLabel(result.status)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Wynik:</span>
                <span className={styles.detailValue}>{result.score} pkt</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Data:</span>
                <span className={styles.detailValue}>
                  {new Date(result.date).toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h4>Szczegóły dodatkowe</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dział:</span>
                <span className={styles.detailValue}>{result.details.department}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Stanowisko:</span>
                <span className={styles.detailValue}>{result.details.position}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Utworzono:</span>
                <span className={styles.detailValue}>
                  {new Date(result.details.createdAt).toLocaleString('pl-PL')}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Zaktualizowano:</span>
                <span className={styles.detailValue}>
                  {new Date(result.details.updatedAt).toLocaleString('pl-PL')}
                </span>
              </div>
            </div>
            {result.details.notes && (
              <div className={styles.notesSection}>
                <span className={styles.detailLabel}>Notatki:</span>
                <p className={styles.notesText}>{result.details.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Funkcje pomocnicze dla statusów
function getStatusVariant(status: Result['status']): string {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'danger'
    case 'pending':
      return 'warning'
    default:
      return 'info'
  }
}

function getStatusLabel(status: Result['status']): string {
  switch (status) {
    case 'active':
      return 'Aktywny'
    case 'inactive':
      return 'Nieaktywny'
    case 'pending':
      return 'Oczekujący'
    default:
      return status
  }
}

// Główny komponent strony
export function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)

  // URL do pobrania danych JSON (zmień na rzeczywisty endpoint)
  const DATA_URL = '/api/results.json'

  const fetchResults = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(DATA_URL)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Nie udało się pobrać danych`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      // W przypadku błędu, użyj przykładowych danych demo
      console.warn('Używam danych demonstracyjnych:', err)
      setResults(getDemoData())
      setError('Używam danych demonstracyjnych (brak połączenia z API)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleRowClick = (result: Result) => {
    setSelectedResult(result)
  }

  const handleCloseDetails = () => {
    setSelectedResult(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <List size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Wyniki</h1>
            <p className={styles.subtitle}>
              Kliknij na wiersz, aby zobaczyć szczegóły
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={fetchResults}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? styles.spinning : ''} />
          Odśwież
        </button>
      </div>

      {error && (
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className={`card ${styles.tableCard}`}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinning} />
            <span>Ładowanie danych...</span>
          </div>
        ) : results.length === 0 ? (
          <div className={styles.emptyState}>
            <span>Brak wyników do wyświetlenia</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imię i nazwisko</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Wynik</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => handleRowClick(result)}
                    className={styles.clickableRow}
                  >
                    <td>{result.id}</td>
                    <td>{result.name}</td>
                    <td>{result.email}</td>
                    <td>
                      <span className={`badge badge-${getStatusVariant(result.status)}`}>
                        {getStatusLabel(result.status)}
                      </span>
                    </td>
                    <td>{result.score} pkt</td>
                    <td>{new Date(result.date).toLocaleDateString('pl-PL')}</td>
                    <td>
                      <Eye size={16} className={styles.viewIcon} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p>Łącznie rekordów: <strong>{results.length}</strong></p>
      </div>

      {selectedResult && (
        <ResultDetails result={selectedResult} onClose={handleCloseDetails} />
      )}
    </div>
  )
}

// Dane demonstracyjne (używane gdy API niedostępne)
function getDemoData(): Result[] {
  return [
    {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      status: 'active',
      score: 95,
      date: '2025-12-28',
      details: {
        department: 'IT',
        position: 'Senior Developer',
        notes: 'Bardzo dobry wynik w projekcie końcowym.',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-12-28T14:22:00Z',
      },
    },
    {
      id: 2,
      name: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      status: 'active',
      score: 88,
      date: '2025-12-27',
      details: {
        department: 'Marketing',
        position: 'Marketing Manager',
        notes: '',
        createdAt: '2025-02-20T09:15:00Z',
        updatedAt: '2025-12-27T11:45:00Z',
      },
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      status: 'pending',
      score: 72,
      date: '2025-12-26',
      details: {
        department: 'Sprzedaż',
        position: 'Sales Representative',
        notes: 'Oczekuje na weryfikację wyników.',
        createdAt: '2025-03-10T14:00:00Z',
        updatedAt: '2025-12-26T16:30:00Z',
      },
    },
    {
      id: 4,
      name: 'Maria Zielińska',
      email: 'maria.zielinska@example.com',
      status: 'inactive',
      score: 45,
      date: '2025-12-20',
      details: {
        department: 'HR',
        position: 'HR Specialist',
        notes: 'Konto dezaktywowane na prośbę użytkownika.',
        createdAt: '2025-04-05T08:45:00Z',
        updatedAt: '2025-12-20T10:00:00Z',
      },
    },
    {
      id: 5,
      name: 'Tomasz Lewandowski',
      email: 'tomasz.lewandowski@example.com',
      status: 'active',
      score: 91,
      date: '2025-12-29',
      details: {
        department: 'IT',
        position: 'DevOps Engineer',
        notes: 'Wyróżniony za wdrożenie CI/CD.',
        createdAt: '2025-05-12T11:20:00Z',
        updatedAt: '2025-12-29T09:15:00Z',
      },
    },
  ]
}
