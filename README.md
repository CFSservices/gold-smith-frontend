# Gold Smith Frontend

A modern web application for gold merchants across India. Built with React 19, TypeScript, Tailwind CSS, and PrimeReact.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 + PrimeReact 10
- **State Management:** Zustand 5
- **Server State:** TanStack Query 5
- **Routing:** React Router 7
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gold-smith-frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Environment Configuration

Environment files are located in the `env/` folder:

| Environment | File | Command |
|-------------|------|---------|
| Local | `env/.env` | `pnpm dev` |
| Development | `env/.env.development` | `pnpm dev:dev` |
| QA | `env/.env.qa` | `pnpm dev:qa` |
| UAT | `env/.env.uat` | `pnpm dev:uat` |
| Production | `env/.env.production` | `pnpm build:prod` |

Copy `env/.env.example` to `env/.env.local` for local overrides (git ignored).

### Available Scripts

```bash
# Development
pnpm dev              # Start local dev server
pnpm dev:dev          # Start with development config
pnpm dev:qa           # Start with QA config
pnpm dev:uat          # Start with UAT config

# Building
pnpm build            # Build for production
pnpm build:dev        # Build for development
pnpm build:qa         # Build for QA
pnpm build:uat        # Build for UAT
pnpm build:prod       # Build for production

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # Run TypeScript type check

# Preview
pnpm preview          # Preview production build
```

## Project Structure

```
src/
├── api/              # API layer (Axios client, services)
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
│   ├── common/       # Generic components
│   ├── layout/       # Layout components
│   └── ui/           # UI-specific components
├── config/           # App configuration
├── features/         # Feature-based modules
│   ├── auth/         # Authentication
│   ├── admin/        # Admin panel
│   └── dashboard/    # User dashboard
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── lib/              # Third-party library configs
├── mocks/            # Mock data for development
├── routes/           # Routing configuration
├── store/            # Zustand stores
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Features

### Authentication
- Login / Register / Forgot Password
- JWT token management with automatic refresh
- Role-based access control (Admin, Merchant, User, Staff)
- Protected routes

### Theming
- Light / Dark / System theme support
- PrimeReact Lara theme integration
- Gold merchant branding colors
- Persistent theme preference

### Admin Panel
- User management
- Dashboard with analytics
- System settings

### User Dashboard
- Overview statistics
- Gold rate display
- Quick actions

## Mock Authentication

For development without a backend, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@goldsmith.com | Admin@123 |
| Merchant | merchant@goldsmith.com | Merchant@123 |
| User | user@goldsmith.com | User@123 |

Enable mock API by setting `VITE_ENABLE_MOCK_API=true` in your `.env` file.

## Architecture Decisions

### State Management
- **Zustand** for client state (auth, theme)
- **TanStack Query** for server state (API data caching)

### Styling
- **Tailwind CSS** for utility-first styling
- **PrimeReact** for enterprise UI components
- **CSS Variables** for theming

### Code Organization
- Feature-based folder structure
- Colocation of related files
- Barrel exports for clean imports

## Development Guidelines

### TypeScript
- Strict mode enabled
- Use explicit types for function parameters
- Prefer interfaces over types for objects

### Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling
- Use Tailwind utilities first
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design

### State
- Keep state as local as possible
- Use Zustand for global client state
- Use TanStack Query for server state

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check`
4. Submit a pull request

## License

Private - All rights reserved
