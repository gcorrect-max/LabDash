# LabDash - Dokumentacja

## Spis treści

1. [Wymagania systemowe](#wymagania-systemowe)
2. [Instalacja](#instalacja)
3. [Konfiguracja](#konfiguracja)
4. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
5. [Użytkowanie](#użytkowanie)
6. [Role i uprawnienia](#role-i-uprawnienia)
7. [Konfiguracja nawigacji](#konfiguracja-nawigacji)
8. [Dodawanie własnej strony](#dodawanie-własnej-strony)
9. [Testowanie](#testowanie)
10. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## Wymagania systemowe

### Minimalne wymagania

- **Node.js**: wersja 18.x lub nowsza
- **npm**: wersja 9.x lub nowsza (instalowany razem z Node.js)
- **Przeglądarka**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **System operacyjny**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Sprawdzenie wersji Node.js i npm

```bash
node --version    # Powinno wyświetlić v18.x.x lub wyżej
npm --version     # Powinno wyświetlić 9.x.x lub wyżej
```

### Instalacja Node.js (jeśli nie jest zainstalowany)

**Windows/macOS:**
Pobierz instalator ze strony https://nodejs.org/

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Instalacja

### Krok 1: Pobranie projektu

```bash
# Sklonuj repozytorium
git clone <adres-repozytorium> LabDash
cd LabDash
```

### Krok 2: Instalacja zależności

```bash
npm install
```

Polecenie to zainstaluje wszystkie wymagane pakiety:
- **react** - biblioteka UI
- **react-router-dom** - routing
- **lucide-react** - ikony
- **vitest** - testy jednostkowe
- **playwright** - testy E2E

### Krok 3: Weryfikacja instalacji

```bash
# Sprawdź czy projekt się kompiluje
npm run build

# Jeśli kompilacja zakończy się sukcesem, instalacja jest poprawna
```

---

## Konfiguracja

### Struktura katalogów

```
LabDash/
├── public/
│   └── config/
│       └── navigation.json    # Konfiguracja menu nawigacji
├── src/
│   ├── components/            # Komponenty React
│   │   ├── layout/            # Komponenty layoutu (Header, Sidebar, Footer)
│   │   ├── routes/            # Komponenty ochrony tras
│   │   └── ui/                # Komponenty UI (Icon)
│   ├── config/
│   │   ├── constants.ts       # Stałe aplikacji
│   │   └── navigation.fallback.ts  # Awaryjne menu
│   ├── contexts/              # Konteksty React (Auth, Navigation, UI)
│   ├── pages/                 # Strony aplikacji
│   ├── services/              # Serwisy API
│   ├── types/                 # Typy TypeScript
│   └── utils/                 # Funkcje pomocnicze
├── tests/
│   ├── e2e/                   # Testy E2E (Playwright)
│   └── unit/                  # Testy jednostkowe (Vitest)
└── package.json
```

### Konfiguracja stałych aplikacji

Plik `src/config/constants.ts` zawiera podstawowe ustawienia:

```typescript
// Wersja aplikacji
export const APP_VERSION = '1.0.0'

// Bazowy URL API
export const API_BASE_URL = '/api/v1'

// Ścieżka do pliku nawigacji
export const NAVIGATION_CONFIG_PATH = '/config/navigation.json'

// Klucze localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'labdash_access_token',
  REFRESH_TOKEN: 'labdash_refresh_token',
  USER: 'labdash_user',
  RETURN_URL: 'labdash_return_url',
}

// Domyślne flagi funkcji
export const DEFAULT_FEATURE_FLAGS = {
  bookingEnabled: true,
  reportsEnabled: true,
  systemEnabled: true,
  serviceToolsEnabled: false,
}
```

### Konfiguracja środowiskowa

Utwórz plik `.env.local` w głównym katalogu projektu (opcjonalnie):

```env
# URL backendu (domyślnie /api/v1)
VITE_API_BASE_URL=/api/v1

# Tryb developerski
VITE_DEV_MODE=true
```

---

## Uruchomienie aplikacji

### Tryb developerski

```bash
npm run dev
```

Aplikacja uruchomi się pod adresem: **http://localhost:5173**

### Tryb produkcyjny

```bash
# Zbuduj aplikację
npm run build

# Uruchom podgląd produkcyjny
npm run preview
```

Aplikacja podglądu uruchomi się pod adresem: **http://localhost:4173**

### Dostępne polecenia

| Polecenie | Opis |
|-----------|------|
| `npm run dev` | Uruchomienie serwera developerskiego |
| `npm run build` | Budowanie wersji produkcyjnej |
| `npm run preview` | Podgląd wersji produkcyjnej |
| `npm run lint` | Sprawdzenie kodu (ESLint) |
| `npm run test` | Uruchomienie testów jednostkowych |
| `npm run test:unit` | Uruchomienie testów jednostkowych (jednorazowo) |
| `npm run test:e2e` | Uruchomienie testów E2E |

---

## Użytkowanie

### Logowanie

1. Otwórz aplikację w przeglądarce: **http://localhost:5173**
2. Zostaniesz automatycznie przekierowany na stronę logowania `/login`
3. Wprowadź dane logowania:
   - **Email**: adres email użytkownika
   - **Hasło**: hasło użytkownika
4. Kliknij przycisk **"Zaloguj się"**

### Konta testowe (tryb demo)

| Email | Hasło | Rola | Opis |
|-------|-------|------|------|
| `admin@example.com` | `admin123` | Administrator | Pełny dostęp do systemu |
| `teacher@example.com` | `teacher123` | Nauczyciel | Dostęp do rezerwacji i raportów |
| `student@example.com` | `student123` | Student | Ograniczony dostęp (rezerwacje) |
| `ziggy@example.com` | `ziggy123` | Serwis | Pełny dostęp + narzędzia serwisowe |

### Nawigacja po aplikacji

Po zalogowaniu zobaczysz dashboard z menu bocznym. Struktura menu:

```
📊 Dashboard           - Strona główna z podsumowaniem
📅 Rezerwacje
   ├── Kalendarz      - Przeglądanie rezerwacji
   └── Zarządzanie    - Administracja rezerwacjami (admin/teacher)
📈 Raporty
   ├── Przeglądaj     - Przeglądanie raportów
   └── Eksport        - Eksport danych (admin/ziggy)
⚙️ System
   ├── Status         - Status systemu
   ├── Logi           - Logi systemowe
   └── Użytkownicy    - Zarządzanie użytkownikami
🔧 Serwis             - Narzędzia serwisowe (tylko ziggy)
❤️ Health Check       - Diagnostyka systemu (admin/ziggy)
```

### Wylogowanie

1. Kliknij przycisk **"Wyloguj"** w prawym górnym rogu nagłówka
2. Zostaniesz przekierowany na stronę logowania
3. Sesja zostanie wyczyszczona z localStorage

### Responsywność

- **Desktop**: Menu boczne jest stale widoczne
- **Mobile** (szerokość < 768px):
  - Menu jest ukryte
  - Kliknij ikonę hamburgera (☰) w nagłówku, aby otworzyć menu
  - Kliknij poza menu lub "X", aby je zamknąć

---

## Role i uprawnienia

### Hierarchia ról

```
ziggy (serwis)
    ↓
admin (administrator)
    ↓
teacher (nauczyciel)
    ↓
student (uczeń)
```

### Szczegółowe uprawnienia

#### Administrator (`admin`)
- ✅ Dashboard
- ✅ Rezerwacje - Kalendarz
- ✅ Rezerwacje - Zarządzanie
- ✅ Raporty - Przeglądaj
- ✅ Raporty - Eksport
- ✅ System - Status
- ✅ System - Logi
- ✅ System - Użytkownicy
- ❌ Serwis - Narzędzia
- ✅ Health Check

#### Nauczyciel (`teacher`)
- ✅ Dashboard
- ✅ Rezerwacje - Kalendarz
- ✅ Rezerwacje - Zarządzanie
- ✅ Raporty - Przeglądaj
- ❌ Raporty - Eksport
- ❌ System (wszystkie)
- ❌ Serwis - Narzędzia
- ❌ Health Check

#### Student (`student`)
- ✅ Dashboard
- ✅ Rezerwacje - Kalendarz
- ❌ Rezerwacje - Zarządzanie
- ❌ Raporty (wszystkie)
- ❌ System (wszystkie)
- ❌ Serwis - Narzędzia
- ❌ Health Check

#### Serwis (`ziggy`)
- ✅ Wszystkie uprawnienia administratora
- ✅ Serwis - Narzędzia

### Uprawnienia (Permissions)

Oprócz ról, system wspiera granularne uprawnienia:

| Uprawnienie | Opis |
|-------------|------|
| `DASHBOARD_VIEW` | Dostęp do dashboardu |
| `BOOKING_VIEW` | Przeglądanie rezerwacji |
| `BOOKING_EDIT` | Edycja rezerwacji |
| `SYSTEM_VIEW` | Przeglądanie statusu systemu |
| `SYSTEM_ADMIN` | Administracja systemem |
| `REPORTS_VIEW` | Przeglądanie raportów |
| `USERS_MANAGE` | Zarządzanie użytkownikami |

---

## Konfiguracja nawigacji

### Plik navigation.json

Menu nawigacji jest definiowane w pliku `public/config/navigation.json`:

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-12-29T12:00:00.000Z",
  "minAppVersion": "1.0.0",
  "defaultRouteByRole": {
    "admin": "/dashboard",
    "teacher": "/dashboard",
    "student": "/booking",
    "ziggy": "/dashboard"
  },
  "featureFlags": {
    "bookingEnabled": true,
    "reportsEnabled": true,
    "systemEnabled": true,
    "serviceToolsEnabled": true
  },
  "items": [
    // ... elementy menu
  ]
}
```

### Typy elementów menu

#### Link (`type: "link"`)

```json
{
  "type": "link",
  "id": "dashboard",
  "label": "Dashboard",
  "path": "/dashboard",
  "icon": "LayoutDashboard",
  "order": 1,
  "rolesAllowed": ["admin", "teacher"],
  "permissionsRequired": ["DASHBOARD_VIEW"],
  "featureFlag": "dashboardEnabled",
  "badge": {
    "text": "Nowy",
    "variant": "success"
  },
  "hidden": false,
  "external": false,
  "exact": true
}
```

#### Grupa (`type: "group"`)

```json
{
  "type": "group",
  "id": "booking-group",
  "label": "Rezerwacje",
  "icon": "Calendar",
  "order": 2,
  "rolesAllowed": ["admin", "teacher", "student"],
  "featureFlag": "bookingEnabled",
  "collapseByDefault": false,
  "children": [
    // ... elementy potomne
  ]
}
```

#### Separator (`type: "divider"`)

```json
{
  "type": "divider",
  "id": "divider-1",
  "order": 3,
  "rolesAllowed": ["admin"]
}
```

### Dostępne ikony

System wykorzystuje bibliotekę Lucide React. Dostępne ikony:

| Nazwa | Opis |
|-------|------|
| `LayoutDashboard` | Dashboard |
| `Calendar` | Kalendarz |
| `CalendarDays` | Dni kalendarza |
| `Settings` | Ustawienia |
| `Server` | Serwer |
| `Activity` | Aktywność |
| `FileText` | Dokument |
| `Users` | Użytkownicy |
| `BarChart3` | Wykres |
| `Download` | Pobieranie |
| `HeartPulse` | Health |
| `Tool` | Narzędzia |

### Warianty badge

| Wariant | Kolor | Użycie |
|---------|-------|--------|
| `info` | Niebieski | Informacje |
| `success` | Zielony | Sukces/Nowy |
| `warning` | Pomarańczowy | Ostrzeżenie |
| `danger` | Czerwony | Błąd/Uwaga |

### Flagi funkcji (Feature Flags)

Flagi umożliwiają włączanie/wyłączanie sekcji menu:

```json
{
  "featureFlags": {
    "bookingEnabled": true,      // Włącza sekcję Rezerwacje
    "reportsEnabled": true,      // Włącza sekcję Raporty
    "systemEnabled": true,       // Włącza sekcję System
    "serviceToolsEnabled": false // Wyłącza sekcję Serwis
  }
}
```

Jeśli flaga jest `false`, wszystkie elementy z `featureFlag: "nazwaFlagi"` zostaną ukryte.

### Menu awaryjne (Fallback)

Jeśli plik `navigation.json` nie może zostać załadowany, system używa wbudowanego menu awaryjnego zdefiniowanego w `src/config/navigation.fallback.ts`.

Wskaźniki trybu awaryjnego:
- Banner ostrzeżenia w nagłówku: **"Menu awaryjne aktywne"**
- Informacja na stronie `/health`
- Wpis w stopce: **(menu awaryjne)**

---

## Dodawanie własnej strony

Ta sekcja opisuje krok po kroku, jak dodać nową stronę do aplikacji. Jako przykład użyjemy strony **Wyniki** (`/results`), która pobiera dane JSON z zewnętrznego URL i wyświetla je w tabeli z możliwością przeglądania szczegółów.

### Krok 1: Utworzenie komponentu strony

Utwórz nowy plik w katalogu `src/pages/`:

**Plik:** `src/pages/MojaStronaPage.tsx`

```tsx
import { useState, useEffect } from 'react'
import { List, Eye, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import styles from './MojaStronaPage.module.css'

// 1. Zdefiniuj typ danych
interface MojeDane {
  id: number
  nazwa: string
  status: string
  // ... inne pola
}

export function MojaStronaPage() {
  // 2. Stan komponentu
  const [dane, setDane] = useState<MojeDane[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wybranyElement, setWybranyElement] = useState<MojeDane | null>(null)

  // 3. URL do pobrania danych
  const DATA_URL = '/api/moje-dane.json'

  // 4. Funkcja pobierająca dane
  const pobierzDane = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(DATA_URL)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setDane(data)
    } catch (err) {
      setError('Nie udało się pobrać danych')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 5. Pobierz dane przy montowaniu
  useEffect(() => {
    pobierzDane()
  }, [])

  // 6. Renderowanie
  return (
    <div className={styles.container}>
      <h1>Moja Strona</h1>

      {/* Tabela z danymi */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dane.map((element) => (
            <tr
              key={element.id}
              onClick={() => setWybranyElement(element)}
              style={{ cursor: 'pointer' }}
            >
              <td>{element.id}</td>
              <td>{element.nazwa}</td>
              <td>{element.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Panel szczegółów */}
      {wybranyElement && (
        <div className={styles.detailsPanel}>
          <h3>Szczegóły: {wybranyElement.nazwa}</h3>
          <p>ID: {wybranyElement.id}</p>
          <p>Status: {wybranyElement.status}</p>
          <button onClick={() => setWybranyElement(null)}>Zamknij</button>
        </div>
      )}
    </div>
  )
}
```

### Krok 2: Utworzenie stylów CSS

Utwórz plik stylów CSS Module:

**Plik:** `src/pages/MojaStronaPage.module.css`

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detailsPanel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
```

### Krok 3: Eksportowanie strony

Dodaj eksport do pliku `src/pages/index.ts`:

```typescript
// ... istniejące eksporty
export { MojaStronaPage } from './MojaStronaPage'
```

### Krok 4: Dodanie stałej trasy

Dodaj stałą trasy w `src/config/constants.ts`:

```typescript
export const ROUTES = {
  // ... istniejące trasy
  MOJA_STRONA: '/moja-strona',
} as const
```

### Krok 5: Zarejestrowanie trasy w routerze

Dodaj trasę w pliku `src/App.tsx`:

```tsx
import { MojaStronaPage } from '@/pages'

// W komponencie AppRoutes, wewnątrz Routes:
<Route
  path={ROUTES.MOJA_STRONA}
  element={
    <RoleProtectedRoute roles={['admin', 'teacher']}>
      <MojaStronaPage />
    </RoleProtectedRoute>
  }
/>
```

### Krok 6: Dodanie do nawigacji

Dodaj wpis w pliku `public/config/navigation.json`:

```json
{
  "type": "link",
  "id": "moja-strona",
  "label": "Moja Strona",
  "path": "/moja-strona",
  "icon": "List",
  "order": 10,
  "rolesAllowed": ["admin", "teacher"]
}
```

### Krok 7: (Opcjonalnie) Dodanie nowej ikony

Jeśli potrzebujesz nowej ikony, dodaj ją w `src/components/ui/Icon.tsx`:

```tsx
import { NowaIkona } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  // ... istniejące ikony
  NowaIkona,
}
```

---

### Przykład praktyczny: Strona Wyniki

W aplikacji znajduje się gotowy przykład strony **Wyniki** (`/results`), która demonstruje:

1. **Pobieranie danych JSON** z zewnętrznego URL
2. **Wyświetlanie tabeli** z wynikami
3. **Kliknięcie na wiersz** otwiera panel szczegółów
4. **Obsługę błędów** z danymi demonstracyjnymi jako fallback
5. **Responsywny design**

#### Struktura danych

```typescript
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
```

#### Konfiguracja URL źródła danych

W pliku `src/pages/ResultsPage.tsx` zmień URL:

```typescript
// Zmień na swój endpoint API
const DATA_URL = '/api/results.json'

// Lub użyj zewnętrznego API
const DATA_URL = 'https://api.example.com/results'
```

#### Przykładowy format JSON

Utwórz plik `public/api/results.json`:

```json
[
  {
    "id": 1,
    "name": "Jan Kowalski",
    "email": "jan.kowalski@example.com",
    "status": "active",
    "score": 95,
    "date": "2025-12-28",
    "details": {
      "department": "IT",
      "position": "Senior Developer",
      "notes": "Bardzo dobry wynik",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-12-28T14:22:00Z"
    }
  },
  {
    "id": 2,
    "name": "Anna Nowak",
    "email": "anna.nowak@example.com",
    "status": "pending",
    "score": 72,
    "date": "2025-12-27",
    "details": {
      "department": "Marketing",
      "position": "Marketing Manager",
      "notes": "",
      "createdAt": "2025-02-20T09:15:00Z",
      "updatedAt": "2025-12-27T11:45:00Z"
    }
  }
]
```

#### Funkcjonalności strony Wyniki

| Funkcja | Opis |
|---------|------|
| **Tabela danych** | Wyświetla listę wyników z kolumnami: ID, Imię, Email, Status, Wynik, Data |
| **Sortowanie** | Dane sortowane według daty |
| **Kliknięcie wiersza** | Otwiera modal ze szczegółami |
| **Panel szczegółów** | Pokazuje wszystkie dane rekordu |
| **Przycisk Odśwież** | Ponownie pobiera dane z API |
| **Obsługa błędów** | W przypadku błędu pokazuje dane demonstracyjne |
| **Statusy kolorowe** | Aktywny (zielony), Oczekujący (pomarańczowy), Nieaktywny (czerwony) |

#### Dostęp do strony

Strona **Wyniki** jest dostępna dla ról:
- `admin`
- `teacher`
- `ziggy`

Studenci nie mają dostępu do tej strony.

---

### Schemat dodawania nowej strony

```
┌─────────────────────────────────────────────────────────────┐
│                    DODAWANIE NOWEJ STRONY                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. src/pages/NowaStrona.tsx         ← Komponent strony     │
│  2. src/pages/NowaStrona.module.css  ← Style CSS            │
│  3. src/pages/index.ts               ← Eksport              │
│  4. src/config/constants.ts          ← Stała ROUTES         │
│  5. src/App.tsx                      ← Trasa w routerze     │
│  6. public/config/navigation.json    ← Pozycja w menu       │
│  7. src/components/ui/Icon.tsx       ← (opcjonalnie) ikona  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Checklist przed wdrożeniem

- [ ] Komponent strony utworzony i eksportowany
- [ ] Style CSS dodane
- [ ] Stała trasy dodana w `constants.ts`
- [ ] Trasa zarejestrowana w `App.tsx`
- [ ] Odpowiednie role/uprawnienia ustawione
- [ ] Pozycja menu dodana w `navigation.json`
- [ ] Ikona dodana (jeśli nowa)
- [ ] Przetestowano dostęp dla różnych ról
- [ ] Sprawdzono responsywność na mobile

---

## Testowanie

### Testy jednostkowe

```bash
# Uruchom testy w trybie watch
npm run test

# Uruchom testy jednorazowo
npm run test:unit

# Uruchom testy z pokryciem kodu
npm run test -- --coverage
```

**Testowane funkcjonalności:**
- Filtrowanie nawigacji według ról
- Walidacja konfiguracji nawigacji
- Sprawdzanie kompatybilności wersji
- Łączenie flag funkcji

### Testy E2E (End-to-End)

```bash
# Zainstaluj przeglądarki Playwright (jednorazowo)
npx playwright install

# Uruchom wszystkie testy E2E
npm run test:e2e

# Uruchom testy w trybie interaktywnym
npm run test:e2e:ui

# Uruchom konkretny plik testowy
npx playwright test tests/e2e/auth.spec.ts
```

**Scenariusze testowe:**

1. **Autentykacja** (`auth.spec.ts`)
   - Przekierowanie na login
   - Wyświetlanie formularza
   - Błędne logowanie
   - Poprawne logowanie (admin, student)
   - Wylogowanie
   - Persystencja sesji po odświeżeniu

2. **Kontrola dostępu** (`access-control.spec.ts`)
   - Dostęp administratora
   - Ograniczenia studenta
   - Ograniczenia nauczyciela
   - Pełny dostęp ziggy

3. **Nawigacja** (`navigation.spec.ts`)
   - Wyświetlanie menu
   - Nawigacja między stronami
   - Filtrowanie menu według roli
   - Strony błędów (403, 404)

---

## Rozwiązywanie problemów

### Problem: Błąd "Cannot find module"

**Przyczyna:** Nieprawidłowa instalacja zależności

**Rozwiązanie:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Strona się nie ładuje (biały ekran)

**Przyczyna:** Błąd JavaScript w konsoli

**Rozwiązanie:**
1. Otwórz DevTools (F12)
2. Sprawdź zakładkę Console
3. Zlokalizuj błąd i napraw

### Problem: "Menu awaryjne aktywne"

**Przyczyna:** Nie można załadować pliku `navigation.json`

**Rozwiązanie:**
1. Sprawdź czy plik istnieje: `public/config/navigation.json`
2. Sprawdź poprawność JSON (walidator online)
3. Sprawdź czy `id` elementów są unikalne
4. Sprawdź stronę `/health` dla szczegółów błędu

### Problem: Przekierowanie na /403 po zalogowaniu

**Przyczyna:** Brak uprawnień do domyślnej strony

**Rozwiązanie:**
1. Sprawdź `defaultRouteByRole` w `navigation.json`
2. Upewnij się, że domyślna trasa jest dostępna dla danej roli

### Problem: Sesja nie persystuje po odświeżeniu

**Przyczyna:** Problemy z localStorage

**Rozwiązanie:**
1. Sprawdź czy localStorage jest włączony
2. Wyczyść localStorage: DevTools → Application → Local Storage → Clear
3. Zaloguj się ponownie

### Problem: Testy E2E nie działają

**Przyczyna:** Brak zainstalowanych przeglądarek

**Rozwiązanie:**
```bash
npx playwright install chromium
```

### Logi diagnostyczne

Aplikacja loguje zdarzenia nawigacji do konsoli:
- `NAV_LOAD_FAILED` - błąd ładowania konfiguracji
- `NAV_FALLBACK_USED` - użycie menu awaryjnego
- `NAV_VERSION_INCOMPATIBLE` - niezgodność wersji
- `NAV_VALIDATION_ERROR` - błąd walidacji

---

## Wsparcie

W przypadku problemów:
1. Sprawdź sekcję [Rozwiązywanie problemów](#rozwiązywanie-problemów)
2. Sprawdź stronę `/health` dla diagnostyki systemu
3. Sprawdź logi w konsoli przeglądarki (F12)
4. Zgłoś problem w systemie śledzenia błędów projektu
