# Frontend App (`frontend`)

This is the Next.js 15 frontend for the monorepo. It uses React, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com/docs) for UI components.

---

## Getting Started

1. **Install dependencies (from the monorepo root):**
   ```sh
   pnpm install
   ```
2. **Run the frontend app:**
   ```sh
   pnpm nx serve frontend
   # or
   pnpm dev
   ```
3. **Open:** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

- `src/app/` – App directory (Next.js 15)
- `src/components/ui/` – UI components (shadcn/ui)
- `src/lib/` – Utilities

---

## UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/docs) for reusable, accessible UI components.

### Adding a New Component

To add a new component, run:

```sh
pnpm shadcn-ui add <component>
```

For example, to add a button:

```sh
pnpm shadcn-ui add button
```

- Components are placed in `src/components/ui/`.
- See [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for available components and usage details.

---

## Development Notes

- Path aliases are configured (e.g., `@/components/ui`).
- Environment variables are managed at the monorepo root.
- For shared utilities, see `packages/shared/`.

---

## Testing

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration tests.

- To run all tests:
  ```sh
  pnpm test
  ```
- Sample tests can be found in `src/app/__tests__/`.
- Write tests for your components and pages to ensure reliability and prevent regressions.

---

## Useful Links

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Monorepo Root README](../README.md)
- [Lucide Icons](https://lucide.dev/icons/)
