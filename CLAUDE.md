# Gold Smith — Frontend (Admin Panel)

## Project Overview

Gold Smith is an **admin-only** web panel for gold merchants. Admins use it to manage jewellery products, orders, savings schemes, customers, deliveries, and content. It is **not** customer-facing — all customer interactions happen through separate iOS/Android mobile apps.

- **Status**: Active feature development (stable base, new features being added)
- **Swagger API**: http://13.233.204.116:3000/swagger-docs/#/
  - ⚠️ This API serves **both** web admin and mobile app — use **Web App / Admin-tagged endpoints only**
- **Figma Design**: https://www.figma.com/design/8Knd6l6fmoyA7V1KU62maL/Gold-Smith---Admin-Prototype--Web-?node-id=229-29366&m=dev

---

## Business Domain

### Core Entities
| Entity | Description |
|--------|-------------|
| **Jewels / Products** | Gold jewellery items with weight, purity, making charges |
| **Orders** | Customer purchase/repair orders managed by admin |
| **Schemes** | Gold savings schemes customers enroll in via mobile app |
| **Deliveries** | Delivery tracking for dispatched orders |
| **Customers** | Customer profiles linked to mobile app accounts |
| **Gold Rate** | Live market rate with admin override capability |

### Order Lifecycle
```
Pending → Confirmed → In Progress / Making → Ready → Delivered
                                                  ↘ Cancelled / Returned
```

### Scheme Types
1. **Monthly savings chit** — customer pays fixed amount monthly, receives gold at end of tenure
2. **Weight accumulation** — customer buys grams over time, redeems as jewellery

### Roles & Permissions
- **Current**: Single super-admin role (full access)
- **Planned**: Staff role with limited access will be added
- **Rule**: Always use `hasRole()` from `authStore` for role checks — never hardcode role assumptions inline. Build role-aware UI from the start so staff role can be added cleanly.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5 (strict mode) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (mobile-first) |
| UI Library | PrimeReact 10 (Lara Amber theme) |
| Client State | Zustand 5 + persist + immer |
| Server State | TanStack React Query 5 |
| Forms | React Hook Form 7 + Zod 4 |
| HTTP | Axios (with interceptors) |
| Routing | React Router 7 |
| Package Manager | pnpm ≥ 8, Node ≥ 18 |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance + request/response interceptors
│   ├── endpoints.ts       # All API endpoint path constants
│   └── services/          # Service classes: auth, order, user, delivery...
├── assets/
│   └── design-system/
│       └── tokens/        # CSS custom properties (colors, typography, spacing)
├── components/
│   ├── ui/                # Generic reusable: Icon, LoadingSpinner, PageHeader, ThemeToggle
│   ├── layout/            # BaseLayout, Header, Sidebar
│   └── orders/            # Order-specific shared modals
├── config/                # App-level config constants
├── features/              # All feature modules (see structure below)
├── hooks/                 # Shared custom hooks
├── layouts/               # AuthLayout, DashboardLayout
├── lib/                   # React Query client setup
├── mocks/                 # MSW handlers + mock data (dev only)
├── routes/                # Router setup, ProtectedRoute, PublicRoute, route constants
├── store/                 # authStore.ts, themeStore.ts
├── types/                 # Shared TypeScript interfaces/types
└── utils/                 # Formatters + shared Zod schemas
```

### Feature Module Structure (mandatory for every new feature)
```
src/features/{feature}/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific React Query hooks (useOrders, useSchemes...)
├── pages/          # Page components (must be lazy-loaded)
├── services/       # Feature service (only if src/api/services/ is insufficient)
└── types/          # Feature-specific TypeScript types
```

### Routes
| Path | Page | Access |
|------|------|--------|
| `/login` | LoginPage | Public |
| `/forgot-password` | ForgotPasswordPage | Public |
| `/dashboard` | DashboardPage | Protected |
| `/orders` | OrdersPage | Protected |
| `/schemes` | SchemesPage | Protected |
| `/jewels` | JewelsPage | Protected |
| `/customers` | CustomersPage | Protected |
| `/content` | ContentPage | Protected |
| `/profile` | ProfilePage | Protected |
| `/settings` | SettingsPage | Protected |
| `*` | NotFoundPage | — |

---

## Figma MCP — UI Development Workflow

The Figma MCP is connected. **Always consult Figma before building any new component or page.**

### Workflow
1. Fetch the relevant Figma node/frame for the feature using the MCP
2. Extract exact specs: colors, spacing, typography, component states, variants
3. Map Figma colors → design tokens (`gold-*`, `secondary-*`) — never hardcode hex values
4. Map Figma text styles → typography classes (`text-xl-bold`, `text-lg-semibold` etc.)
5. Match PrimeReact components to Figma components before building anything custom
6. Implement using Tailwind utility classes — never `style={{}}` inline styles

Detailed design system integration rules: `.cursor/rules/figma-design.mdc`

---

## Hard Rules

### UI / Design
- **ALWAYS** fetch Figma specs before building a new component or page
- **ALWAYS** use PrimeReact — never build custom modals, tables, dropdowns, calendars, or inputs when PrimeReact has one
- **NEVER** use `style={{}}` inline styles — Tailwind classes only
- **NEVER** hardcode hex color values — use design tokens (`gold-*`, `secondary-*`)

### Structure
- **ALL** new features go under `src/features/{feature}/` — no exceptions
- **ONLY** path aliases — never relative imports like `../../../` (aliases: `@components/`, `@features/`, `@store/`, `@api/`, `@hooks/`, `@utils/`, `@types/`, `@lib/`, `@config/`, `@assets/`)

### Async / Loading
- **EVERY** async action must show a visible loading state (spinner, skeleton, or disabled button with loading indicator)
- **NEVER** use `useState` to manage API/server data — use React Query

### Code Quality
- No `console.log` — use `console.warn` / `console.error` only
- No `any` type — define proper TypeScript interfaces
- Prefer `??` over `||` for nullish checks
- Prefer `?.` for optional chaining over manual null checks
- No floating promises — always `await` or attach `.catch()`

---

## State Management

### Zustand Stores (client/UI state only)

**`authStore`** (`src/store/authStore.ts`):
- State: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isLoading`, `error`
- Persisted to localStorage
- Selector hooks: `useUser()`, `useIsAuthenticated()`, `useAuthLoading()`, `useAuthError()`
- Role check: `hasRole('admin')` — always use this for any conditional UI

**`themeStore`** (`src/store/themeStore.ts`):
- State: `theme` (light/dark/system), `resolvedTheme`
- Persisted; handles system preference detection and PrimeReact CDN theme link swap
- Never subscribe to the full store object — always use selector hooks

### React Query (server/remote state)
- staleTime: 5 min, gcTime: 10 min
- Define query keys as constants or factory functions — never inline strings
- 401 responses are handled automatically by the axios interceptor (token refresh + retry)

---

## API Patterns

### Axios Client (`src/api/client.ts`)
- Request interceptor: attaches `Authorization: Bearer <token>`
- Response interceptor: 401 → refresh token → retry original request; on refresh failure → logout

### Service Layer
- **Never call axios directly from components or hooks**
- All API calls go through `src/api/services/` classes
- All endpoint paths are constants in `src/api/endpoints.ts`

### Mock API
- Toggle: `VITE_ENABLE_MOCK_API=true` (enabled by default in development)
- Handlers: `src/mocks/handlers.ts`, data: `src/mocks/data/`
- Uses MSW — same handlers used in tests

---

## Form Pattern

```ts
// 1. Define schema
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// 2. Infer type
type FormData = z.infer<typeof schema>;

// 3. Use with zodResolver
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<FormData>({ resolver: zodResolver(schema) });

// 4. Display errors
// <small>{errors.email?.message}</small>
```

Reuse shared Zod schemas from `src/utils/` for email, password, phone validation.

---

## Styling System

| Token | Value |
|-------|-------|
| Font (primary) | Noto Sans |
| Font (fallback) | Inter |
| Gold palette | `gold-50` → `gold-950`, `gold-dark`, `gold-medium`, `gold-light` |
| Secondary palette | `secondary-50` → `secondary-950` |
| Dark mode | `.dark` class on `<html>`, managed by `themeStore` |

### Typography Classes (from design system)
Use these global classes instead of composing font-size + weight individually:
- `text-2xl-bold`, `text-xl-bold`, `text-xl-semibold`
- `text-lg-bold`, `text-lg-semibold`, `text-lg-medium`, `text-lg-normal`
- `text-base-bold`, `text-base-semibold`, `text-base-medium`, `text-base-normal`
- `text-sm-semibold`, `text-sm-medium`, `text-sm-normal`
- `text-xs-medium`, `text-xs-normal`

### CSS Layer Order (critical — do not break this)
```
theme → primereact → base → utilities
```
See `.cursor/design-system-audit.md` for full CSS cascade analysis.

---

## Performance Checklist

- Lazy load all page components: `React.lazy()` + `<Suspense fallback={<LoadingSpinner />}>`
- `React.memo` for list item components and pure display components
- `useMemo` for filtered, sorted, or derived data computations
- `useCallback` for event handlers passed as props to memoized children
- Zustand: always select specific slices — never destructure the full store
- Vite manual chunks configured: `vendor`, `ui`, `state`

---

## Accessibility

- Target: **WCAG 2.1 Level AA**
- Use semantic HTML: `<main>`, `<nav>`, `<section>`, `<header>`, `<button>`, `<form>`
- All interactive elements must be keyboard-accessible (focus ring visible)
- Icon-only buttons must have `aria-label`
- PrimeReact components are ARIA-compliant — another strong reason to use them over custom components

---

## Commands & Environments

```bash
# Development
pnpm dev              # Local dev server (port 3000, mock API on)
pnpm dev:qa           # QA environment
pnpm dev:uat          # UAT environment

# Build
pnpm build            # Production build (default)
pnpm build:dev        # Dev build
pnpm build:qa         # QA build
pnpm build:uat        # UAT build
pnpm build:prod       # Production build (explicit)

# Code quality
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format src/**
pnpm format:check     # Prettier check (CI)
pnpm type-check       # tsc --noEmit
pnpm preview          # Preview production build
```

**Env files**: `/env/.env`, `.env.development`, `.env.qa`, `.env.uat`, `.env.production`

Key env variables:
- `VITE_API_BASE_URL` — API base URL
- `VITE_ENABLE_MOCK_API` — enable MSW mock API (true in dev)

---

## Key Utilities (`src/utils/`)

| Utility | Purpose |
|---------|---------|
| Currency | Format amounts as Indian Rupees (₹) |
| Weight | Convert between gram, kg, tola, ounce |
| Date/Time | Format dates and times consistently |
| Phone | Format Indian phone numbers |
| Validation | Reusable Zod schemas: `emailSchema`, `passwordSchema`, `phoneSchema` |

---

## Cursor Rules Reference

Detailed coding rules are in `.cursor/rules/`:

| File | Topic |
|------|-------|
| `core-standards.mdc` | General principles, naming, structure |
| `components.mdc` | Component patterns and organization |
| `react-typescript.mdc` | React + TypeScript patterns |
| `styling.mdc` | Tailwind, typography, dark mode |
| `primereact.mdc` | PrimeReact usage and styling |
| `figma-design.mdc` | Figma → design token mapping |
| `state-management.mdc` | Zustand patterns |
| `api-data-fetching.mdc` | React Query + Axios patterns |
| `forms-validation.mdc` | React Hook Form + Zod |
| `routing.mdc` | React Router 7 patterns |
| `error-boundaries.mdc` | Error handling patterns |
| `performance.mdc` | Optimization techniques |
| `accessibility.mdc` | WCAG guidelines |
| `testing.mdc` | Vitest + RTL + MSW |
| `environment-config.mdc` | Env variables and Vite config |

Design system CSS cascade analysis: `.cursor/design-system-audit.md`
