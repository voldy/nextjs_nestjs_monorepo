# Frontend App (`frontend`)

This is the Next.js 15 frontend application for the monorepo. It uses React 19, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com/docs) for a modern, accessible UI experience.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19 with modern features
- **Styling**: Tailwind CSS + CSS Variables
- **Components**: shadcn/ui for accessible, customizable components
- **Icons**: Lucide React icons
- **Testing**: Jest + React Testing Library + JSDOM
- **Build**: SWC for fast compilation
- **Linting**: ESLint 9+ with React/Next.js rules
- **Shared Utilities**: `@shared` package for cross-platform utilities and environment validation

---

## 🛠️ Getting Started

### From Monorepo Root

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development server:**

   ```bash
   # Start frontend only
   pnpm dev:frontend

   # Or start both frontend and backend
   pnpm dev
   ```

3. **Open:** [http://localhost:3000](http://localhost:3000)

### Direct Nx Commands

```bash
# Development server
nx serve frontend

# Build for production
nx build frontend

# Run tests
nx test frontend

# Lint code
nx lint frontend
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── __tests__/          # Page tests
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── theme-provider.tsx  # Dark/light theme provider
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── project.json                # Nx project configuration
├── next.config.mjs            # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── components.json            # shadcn/ui configuration
└── README.md
```

---

## 🎨 UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/docs) for reusable, accessible UI components built on Radix UI primitives.

### Adding Components

From the monorepo root:

```bash
# Add individual components
pnpm shadcn add button
pnpm shadcn add card
pnpm shadcn add dialog
pnpm shadcn add form

# Add multiple components
pnpm shadcn add button card dialog
```

Components are automatically installed to `src/components/ui/` with:

- TypeScript support
- Tailwind CSS styling
- Full accessibility (ARIA attributes)
- Keyboard navigation
- Dark mode support

### Available Components

See the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components.

### Customization

- **Styling**: Modify `src/app/globals.css` for CSS variables
- **Theme**: Edit `tailwind.config.ts` for Tailwind customization
- **Components**: Customize individual components in `src/components/ui/`

---

## 🧪 Testing

### Running Tests

```bash
# From monorepo root (recommended)
pnpm test:frontend    # Run frontend tests only
pnpm test             # Run tests for all projects
pnpm test:watch       # Run all tests in watch mode

# Direct Nx commands
nx test frontend      # Run all tests
nx test frontend --watch      # Watch mode
nx test frontend --coverage   # With coverage
```

### Test Structure

- **Unit tests**: Component and utility testing
- **Integration tests**: Page and feature testing
- **Setup**: Uses Jest + React Testing Library + JSDOM
- **Location**: Tests are colocated with components or in `__tests__` directories

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })
})
```

---

## 🎯 Development Features

### Path Aliases

Configured path aliases for clean imports:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Theme Support

- **Dark/Light mode** with system preference detection
- **Theme provider** for consistent theming
- **CSS variables** for easy customization

### Hot Reloading

- Fast refresh for React components
- Instant style updates with Tailwind CSS
- Auto-reload on configuration changes

---

## 🏗️ Building & Deployment

### Build Commands

```bash
# Development build
nx build frontend --configuration=development

# Production build (optimized)
nx build frontend --configuration=production

# Analyze bundle
nx build frontend --analyze
```

### Output

- **Development**: `frontend/` directory
- **Production**: `dist/frontend/` directory
- **Static export**: Configure in `next.config.mjs` if needed

### Environment Variables

Create `.env.local` in the project root for environment-specific variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔧 Configuration Files

- **`next.config.mjs`**: Next.js configuration (build, images, etc.)
- **`tailwind.config.ts`**: Tailwind CSS configuration and theme
- **`tsconfig.json`**: TypeScript configuration (extends base config)
- **`components.json`**: shadcn/ui component configuration
- **`project.json`**: Nx project targets and options

---

## 📚 Key Dependencies

### Core Framework

- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM renderer

### UI & Styling

- `tailwindcss` - Utility-first CSS framework
- `@radix-ui/react-*` - Accessible UI primitives
- `lucide-react` - Beautiful icons
- `class-variance-authority` - Type-safe variant styling

### Development Tools

- `typescript` - Type safety
- `eslint` - Code linting
- `prettier` - Code formatting
- `jest` - Testing framework
- `@testing-library/react` - Testing utilities

---

## 🔗 Useful Links

- **[Next.js Documentation](https://nextjs.org/docs)** - Framework features and API
- **[React Documentation](https://react.dev)** - React concepts and hooks
- **[shadcn/ui Components](https://ui.shadcn.com/docs/components)** - Available UI components
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS utilities and styling
- **[Lucide Icons](https://lucide.dev/icons/)** - Icon library
- **[Radix UI](https://www.radix-ui.com/primitives)** - Accessible component primitives
- **[Monorepo Root README](../README.md)** - Full monorepo documentation

---

## 💡 Tips

- Use `shadcn add` to add new UI components
- Leverage Tailwind CSS utilities for rapid styling
- Write tests for critical user flows and components
- Use path aliases (`@/`) for cleaner imports
- Follow the [Next.js App Router patterns](https://nextjs.org/docs/app) for routing
- Utilize React 19 features like Server Components and Actions

## 📦 Shared Package Integration

The frontend integrates with the monorepo's shared utilities library (`@shared`) for:

### Environment Configuration

```typescript
import { Env } from '@shared'

// Validated environment variables (works in Server Components)
console.log(`API Port: ${Env.PORT}`)
console.log(`Environment: ${Env.NODE_ENV}`)
```

### Browser Detection

```typescript
import { isBrowser } from '@shared'

// Client vs Server logic
if (isBrowser()) {
  // Client-side only code
  document.title = 'My App'
  localStorage.setItem('key', 'value')
} else {
  // Server-side rendering code
  console.log('Rendering on server')
}
```

### Utilities and Logging

```typescript
import { logger, deepMerge, sleep } from '@shared'

// Cross-platform logging
logger.log('Component mounted')
logger.warn('API deprecated', { version: '1.0' })

// Utility functions
const mergedConfig = deepMerge(defaultConfig, userConfig)
await sleep(1000) // Promise-based delay
```

### Usage in Components

```typescript
'use client' // For client components using React hooks

import { useEffect } from 'react'
import { logger, isBrowser } from '@shared'

export default function MyComponent() {
  useEffect(() => {
    if (isBrowser()) {
      logger.log('Client component mounted')
    }
  }, [])

  return <div>My Component</div>
}
```

**Note**: Server Components can use shared utilities directly, while Client Components need the `'use client'` directive for React hooks.

---
