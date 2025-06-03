# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Milkyano Barber Web application - a modern booking platform for Fadedlines Barbershop. The application enables customers to view barber profiles, browse services, and book appointments through integration with Square API.

## Common Development Commands

```bash
# Install dependencies (uses Yarn)
yarn install

# Start development server (default port 5173)
yarn dev

# Build for production
yarn build

# Run ESLint
yarn lint

# Preview production build
yarn preview
```

## High-Level Architecture

### Technology Stack
- **React 18.2** with TypeScript
- **Vite 5.2** for build tooling
- **Tailwind CSS** + SCSS for styling
- **Radix UI/Shadcn** for UI components
- **React Router DOM** for routing
- **React Hook Form + Zod** for forms and validation
- **Axios** for API communication
- **Square API** integration for bookings

### Project Structure

```
src/
├── components/       # Reusable components organized by feature
│   ├── book/        # Booking flow components
│   ├── landing/     # Landing page components
│   ├── ui/          # Base UI components (Shadcn/Radix)
│   └── web/         # Main website components
├── pages/           # Page components
│   ├── landing/     # Individual barber landing pages (11 barbers)
│   └── web/         # Main site pages
├── utils/           # API clients and utilities
├── hooks/           # Custom React hooks
└── interfaces/      # TypeScript type definitions
```

### Key Application Features

1. **Multi-barber Landing Pages**: Individual landing pages for each of the 11 barbers
2. **Booking Flow**: Multi-step booking process (`/book/services` → `/book/appointment` → `/book/contact-info` → `/book/thank-you`)
3. **Analytics Integration**: Google Tag Manager for conversion tracking
4. **Theme Support**: Dark/light mode via ThemeProvider

### API Integration

The application communicates with a backend API through clients in `utils/`:
- `apiClients.ts`: Main API client configuration
- `barberApi.ts`: Barber-specific endpoints
- `newApi.ts`: Updated API endpoints

### Routing Architecture

- **Main Routes**: Home, Barbers, Gallery, About Us, Careers, Contact
- **Dynamic Barber Routes**: `/{barber-name}` for individual barber pages
- **Booking Routes**: Multi-step booking flow under `/book/*`
- **Meta Routes**: Duplicate routes with `/meta` prefix for tracking purposes

### Environment Configuration

Key environment variables:
- `VITE_API_WEB_BASE_URL`: Backend API URL
- `VITE_API_KEY_SQUARE`: Square API authentication
- `VITE_SQUARE_LOCATION_ID`: Square location identifier
- `VITE_BASE_URL_MINIO`: Asset storage URL

### Build and Deployment

- Docker containerization with Nginx for production serving
- Docker image: `aldovadev/barber-web`
- Path aliasing: `@/` resolves to `src/` directory