# LabDash - Dokumentacja

## Spis treści

1. [Wymagania systemowe](#wymagania-systemowe)
2. [Instalacja](#instalacja)
3. [Konfiguracja](#konfiguracja)
4. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
5. [Użytkowanie](#użytkowanie)
6. [Role i uprawnienia](#role-i-uprawnienia)
7. [Konfiguracja nawigacji](#konfiguracja-nawigacji)
8. [Testowanie](#testowanie)
9. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

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
