'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Trash2, Edit2, Search, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import type { UserRole } from '@/types'
import { usersApi } from '@/services/api'
import styles from './SystemUsersPage.module.css'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  group?: string
  createdAt?: string
  lastLogin?: string
  isActive?: boolean
}

interface FormData {
  name: string
  email: string
  role: UserRole
  group?: string
}

export function SystemUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'student',
    group: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const roles: UserRole[] = ['admin', 'teacher', 'student', 'ziggy']

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (err) {
      setError('Błąd podczas ładowania użytkowników')
      console.error(err)
      // Fallback to mock data if API fails
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: '2024-01-15',
          lastLogin: '2025-12-31',
          isActive: true,
        },
        {
          id: '2',
          name: 'Teacher One',
          email: 'teacher@example.com',
          role: 'teacher',
          createdAt: '2024-02-01',
          lastLogin: '2025-12-30',
          isActive: true,
        },
        {
          id: '3',
          name: 'Student Demo',
          email: 'student@example.com',
          role: 'student',
          group: 'Grupa A',
          createdAt: '2024-03-10',
          lastLogin: '2025-12-25',
          isActive: true,
        },
        {
          id: '4',
          name: 'Student Test',
          email: 'student.test@example.com',
          role: 'student',
          group: '1B',
          createdAt: '2024-03-15',
          lastLogin: '2025-12-28',
          isActive: true,
        },
      ]
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      setError('Wszystkie pola są wymagane')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Podaj prawidłowy adres email')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      if (editingId) {
        // Update
        await usersApi.update(editingId, formData)
        setUsers(
          users.map((u) =>
            u.id === editingId
              ? { ...u, ...formData }
              : u
          )
        )
        setEditingId(null)
      } else {
        // Create
        const newUser = await usersApi.create({
          ...formData,
          isActive: true,
        })
        setUsers([...users, newUser])
      }

      resetForm()
      setError(null)
      setSuccess(editingId ? 'Użytkownik został zaktualizowany' : 'Użytkownik został dodany')
      // Ukryj wiadomość o sukcesie po 3 sekundach
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      let errorMessage = editingId ? 'Błąd podczas aktualizacji użytkownika' : 'Błąd podczas tworzenia użytkownika'
      
      // Szczegółowe komunikaty na podstawie błędu
      if (err?.response?.status === 409) {
        errorMessage = 'Ten adres email jest już zarejestrowany w systemie'
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Błąd walidacji danych. Sprawdź wszystkie pola'
      } else if (err?.response?.status === 401) {
        errorMessage = 'Sesja wygasła. Zaloguj się ponownie'
      } else if (err?.response?.status === 403) {
        errorMessage = 'Nie masz uprawnień do tej operacji'
      } else if (err?.response?.status === 404) {
        errorMessage = 'Użytkownik nie został znaleziony'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Błąd serwera. Spróbuj ponownie później'
      } else if (err?.message === 'Network Error') {
        errorMessage = 'Problem z połączeniem. Sprawdź swoją sieć'
      } else if (err?.message) {
        errorMessage = `${errorMessage}: ${err.message}`
      }
      
      setError(errorMessage)
      console.error('Błąd operacji:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setEditingId(user.id)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return
    }

    setError(null)
    try {
      await usersApi.delete(id)
      setUsers(users.filter((u) => u.id !== id))
      setSuccess('Użytkownik został usunięty')
      // Ukryj wiadomość o sukcesie po 3 sekundach
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      let errorMessage = 'Błąd podczas usuwania użytkownika'
      
      if (err?.response?.status === 401) {
        errorMessage = 'Sesja wygasła. Zaloguj się ponownie'
      } else if (err?.response?.status === 403) {
        errorMessage = 'Nie masz uprawnień do usuwania użytkowników'
      } else if (err?.response?.status === 404) {
        errorMessage = 'Użytkownik już nie istnieje w systemie'
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Błąd serwera. Spróbuj ponownie później'
      } else if (err?.message === 'Network Error') {
        errorMessage = 'Problem z połączeniem. Sprawdź swoją sieć'
      } else if (err?.message) {
        errorMessage = `${errorMessage}: ${err.message}`
      }
      
      setError(errorMessage)
      console.error('Błąd usuwania:', err)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      group: '',
    })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    teacher: 'Nauczyciel',
    student: 'Student',
    ziggy: 'Serwis',
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Users size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Zarządzanie użytkownikami</h1>
            <p className={styles.subtitle}>
              {users.length} użytkowników w systemie
            </p>
          </div>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={styles.btnPrimary}
        >
          <Plus size={20} />
          {showForm ? 'Anuluj' : 'Dodaj użytkownika'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.errorAlert}>
          <div className={styles.errorContent}>
            <AlertCircle size={20} className={styles.errorIcon} />
            <div>
              <p className={styles.errorTitle}>Błąd</p>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className={styles.errorClose}
            title="Zamknij"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className={styles.successAlert}>
          <div className={styles.successContent}>
            <CheckCircle size={20} className={styles.successIcon} />
            <p className={styles.successMessage}>{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className={styles.successClose}
            title="Zamknij"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className={`card ${styles.formCard}`}>
          <h2 className={styles.formTitle}>
            {editingId ? 'Edytuj użytkownika' : 'Nowy użytkownik'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Imię i nazwisko *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Jan Kowalski"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Rola *</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserRole,
                  })
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </div>

            {formData.role === 'student' && (
              <div className={styles.formGroup}>
                <label htmlFor="group">Grupa</label>
                <input
                  id="group"
                  type="text"
                  value={formData.group || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, group: e.target.value })
                  }
                  placeholder="np. Grupa A, 1A, 101"
                  disabled={submitting}
                />
              </div>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSuccess}>
                <Save size={18} />
                {editingId ? 'Zapisz zmiany' : 'Dodaj użytkownika'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={styles.btnSecondary}
              >
                <X size={18} />
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Szukaj po nazwie lub emailu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={styles.clearSearch}
          >
            ✕
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className={`card ${styles.tableCard}`}>
        {loading ? (
          <p className={styles.loading}>Ładowanie użytkowników...</p>
        ) : filteredUsers.length === 0 ? (
          <p className={styles.empty}>
            {users.length === 0
              ? 'Brak użytkowników w systemie'
              : 'Nie znaleziono użytkowników'}
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Email</th>
                  <th>Rola</th>
                  <th>Grupa</th>
                  <th>Utworzono</th>
                  <th>Ostatnie logowanie</th>
                  <th>Status</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.nameCell}>
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge-${user.role}`]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className={styles.groupCell}>
                      {user.role === 'student' ? user.group || '-' : '-'}
                    </td>
                    <td className={styles.date}>{user.createdAt || '-'}</td>
                    <td className={styles.date}>{user.lastLogin || '-'}</td>
                    <td>
                      <span className={styles.status}>
                        {user.isActive !== false ? '✓ Aktywny' : '✕ Nieaktywny'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(user)}
                          className={styles.btnEdit}
                          title="Edytuj"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className={styles.btnDelete}
                          title="Usuń"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
