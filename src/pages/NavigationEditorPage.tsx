import React, { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  FileJson,
} from 'lucide-react'
import { NAVIGATION_CONFIG_PATH } from '@/config/constants'
import { validateNavigationConfig } from '@/utils/navigation'
import { useNavigation } from '@/contexts'
import type { NavigationConfig, NavItem } from '@/types'
import styles from './NavigationEditorPage.module.css'

interface ValidationResult {
  valid: boolean
  error?: string
  config?: NavigationConfig
}

function validateJson(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString)

    if (!validateNavigationConfig(parsed)) {
      return {
        valid: false,
        error: 'Nieprawidłowa struktura konfiguracji nawigacji. Sprawdź czy wszystkie wymagane pola są obecne i czy ID są unikalne.',
      }
    }

    return { valid: true, config: parsed }
  } catch (e) {
    return {
      valid: false,
      error: `Błąd parsowania JSON: ${e instanceof Error ? e.message : 'Nieznany błąd'}`,
    }
  }
}

function countItems(items: NavItem[]): number {
  let count = 0
  for (const item of items) {
    count++
    if (item.type === 'group') {
      count += countItems(item.children)
    }
  }
  return count
}

interface NavPreviewProps {
  config: NavigationConfig
}

function NavPreview({ config }: NavPreviewProps) {
  const renderItem = (item: NavItem, depth: number = 0): React.ReactElement => {
    const indent = { paddingLeft: `${depth * 20}px` }

    if (item.type === 'divider') {
      return (
        <div key={item.id} className={styles.previewDivider} style={indent}>
          ─── separator ───
        </div>
      )
    }

    if (item.type === 'group') {
      return (
        <div key={item.id} className={styles.previewGroup}>
          <div className={styles.previewItem} style={indent}>
            <span className={styles.previewIcon}>📁</span>
            <span className={styles.previewLabel}>{item.label}</span>
            {item.rolesAllowed && (
              <span className={styles.previewRoles}>
                [{item.rolesAllowed.join(', ')}]
              </span>
            )}
          </div>
          <div className={styles.previewChildren}>
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        </div>
      )
    }

    return (
      <div key={item.id} className={styles.previewItem} style={indent}>
        <span className={styles.previewIcon}>📄</span>
        <span className={styles.previewLabel}>{item.label}</span>
        <span className={styles.previewPath}>{item.path}</span>
        {item.rolesAllowed && (
          <span className={styles.previewRoles}>
            [{item.rolesAllowed.join(', ')}]
          </span>
        )}
        {item.badge && (
          <span className={`badge badge-${item.badge.variant || 'info'}`}>
            {item.badge.text}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={styles.preview}>
      <div className={styles.previewHeader}>
        <h4>Podgląd struktury</h4>
        <div className={styles.previewStats}>
          <span>Wersja: {config.version}</span>
          <span>Elementów: {countItems(config.items)}</span>
        </div>
      </div>
      <div className={styles.previewContent}>
        {config.items.map((item) => renderItem(item))}
      </div>
    </div>
  )
}

export function NavigationEditorPage() {
  const { reload: _reload } = useNavigation()
  const [originalJson, setOriginalJson] = useState('')
  const [editedJson, setEditedJson] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [validation, setValidation] = useState<ValidationResult>({ valid: true })
  const [showPreview, setShowPreview] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    setHasChanges(editedJson !== originalJson)
    if (editedJson) {
      const result = validateJson(editedJson)
      setValidation(result)
    }
  }, [editedJson, originalJson])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch(NAVIGATION_CONFIG_PATH)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const text = await response.text()
      const formatted = JSON.stringify(JSON.parse(text), null, 2)
      setOriginalJson(formatted)
      setEditedJson(formatted)
    } catch (error) {
      console.error('Failed to load navigation config:', error)
      setSaveMessage({
        type: 'error',
        text: 'Nie udało się załadować konfiguracji nawigacji',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setEditedJson(originalJson)
    setSaveMessage(null)
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(editedJson)
      setEditedJson(JSON.stringify(parsed, null, 2))
    } catch {
      // Ignore formatting errors
    }
  }

  const handleSave = async () => {
    if (!validation.valid) {
      setSaveMessage({
        type: 'error',
        text: 'Nie można zapisać - konfiguracja zawiera błędy',
      })
      return
    }

    setSaving(true)
    setSaveMessage(null)

    try {
      // W prawdziwej aplikacji tutaj byłoby wywołanie API
      // POST /api/v1/config/navigation
      // await fetch('/api/v1/config/navigation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: editedJson,
      // })

      // Symulacja zapisu (w trybie demo)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // W trybie demo nie możemy faktycznie zapisać pliku,
      // więc pokazujemy instrukcję
      setSaveMessage({
        type: 'success',
        text: 'Konfiguracja zwalidowana poprawnie. W trybie demo skopiuj JSON i ręcznie zaktualizuj plik public/config/navigation.json',
      })

      setOriginalJson(editedJson)

      // Przeładuj nawigację (w prawdziwej aplikacji)
      // await reload()
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Błąd podczas zapisywania konfiguracji',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedJson)
      setSaveMessage({
        type: 'success',
        text: 'Skopiowano do schowka',
      })
      setTimeout(() => setSaveMessage(null), 2000)
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Nie udało się skopiować do schowka',
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([editedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'navigation.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        const formatted = JSON.stringify(JSON.parse(content), null, 2)
        setEditedJson(formatted)
      } catch {
        setEditedJson(content)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Ładowanie konfiguracji...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Settings size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Edytor nawigacji</h1>
            <p className={styles.subtitle}>
              Edytuj konfigurację menu nawigacji (navigation.json)
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`alert alert-${saveMessage.type === 'success' ? 'success' : 'error'}`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <label className={`btn btn-secondary ${styles.uploadBtn}`}>
            <Upload size={16} />
            Wczytaj plik
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              hidden
            />
          </label>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <Download size={16} />
            Pobierz
          </button>
          <button className="btn btn-secondary" onClick={handleCopy}>
            <Copy size={16} />
            Kopiuj
          </button>
          <button className="btn btn-secondary" onClick={handleFormat}>
            <FileJson size={16} />
            Formatuj
          </button>
        </div>

        <div className={styles.toolbarRight}>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw size={16} />
            Przywróć
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !validation.valid || !hasChanges}
          >
            <Save size={16} />
            {saving ? 'Zapisywanie...' : 'Zapisz'}
          </button>
        </div>
      </div>

      <div className={styles.validationStatus}>
        {validation.valid ? (
          <div className={styles.validationSuccess}>
            <CheckCircle size={16} />
            <span>JSON poprawny</span>
          </div>
        ) : (
          <div className={styles.validationError}>
            <AlertTriangle size={16} />
            <span>{validation.error}</span>
          </div>
        )}
        {hasChanges && (
          <div className={styles.changesIndicator}>
            <span>● Niezapisane zmiany</span>
          </div>
        )}
      </div>

      <div className={`${styles.editorContainer} ${showPreview ? styles.withPreview : ''}`}>
        <div className={styles.editorWrapper}>
          <div className={styles.editorHeader}>
            <span>navigation.json</span>
            <span className={styles.lineCount}>
              {editedJson.split('\n').length} linii
            </span>
          </div>
          <textarea
            className={styles.editor}
            value={editedJson}
            onChange={(e) => setEditedJson(e.target.value)}
            spellCheck={false}
            placeholder="Wklej konfigurację JSON..."
          />
        </div>

        {showPreview && validation.valid && validation.config && (
          <NavPreview config={validation.config} />
        )}
      </div>

      <div className={`card ${styles.helpCard}`}>
        <h3>Instrukcja</h3>
        <ol className={styles.helpList}>
          <li>Edytuj konfigurację JSON w edytorze powyżej</li>
          <li>System automatycznie waliduje poprawność JSON i struktury</li>
          <li>Użyj podglądu po prawej stronie, aby zobaczyć strukturę menu</li>
          <li>Kliknij <strong>Zapisz</strong> aby zwalidować zmiany</li>
          <li>W trybie demo: skopiuj JSON i ręcznie zaktualizuj plik <code>public/config/navigation.json</code></li>
          <li>Odśwież stronę, aby zobaczyć zmiany w nawigacji</li>
        </ol>

        <h4>Struktura elementu menu</h4>
        <pre className={styles.helpCode}>{`{
  "type": "link",        // "link" | "group" | "divider"
  "id": "unique-id",     // Unikalny identyfikator
  "label": "Etykieta",   // Wyświetlana nazwa
  "path": "/sciezka",    // Ścieżka URL (tylko dla link)
  "icon": "IconName",    // Nazwa ikony z Lucide
  "order": 1,            // Kolejność sortowania
  "rolesAllowed": ["admin", "teacher"],  // Dozwolone role
  "permissionsRequired": ["PERMISSION"], // Wymagane uprawnienia
  "featureFlag": "flagName",  // Flaga funkcji
  "badge": { "text": "Nowy", "variant": "success" }
}`}</pre>
      </div>
    </div>
  )
}
