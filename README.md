# Monorepo: Next.js + NestJS + Shared Packages

This is a modern monorepo powered by [Nx](https://nx.dev) and [pnpm](https://pnpm.io/), containing a Next.js frontend, a backend (NestJS or similar), and shared packages.

---

## Project Structure

- **frontend/** – Next.js 15 app (React, Tailwind CSS, shadcn/ui)
- **packages/shared/** – Shared utilities (e.g., environment validation with zod)
- **frontend-e2e/** – End-to-end tests (Playwright)

---

## Getting Started

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Run the frontend app:**
   ```sh
   pnpm nx serve frontend
   # or
   pnpm dev -F frontend
   ```
3. **Run all apps:**
   ```sh
   pnpm nx run-many --target=serve --all
   ```

---

## Nx Usage

- Run any target:
  ```sh
  pnpm nx <target> <project>
  # e.g.
  pnpm nx build frontend
  ```
- Visualize the project graph:
  ```sh
  pnpm nx graph
  ```
- See [Nx documentation](https://nx.dev) for more.

---

## Environment & Configuration

- Environment variables are managed with dotenv and validated using zod in `packages/shared/env.ts`.
- Copy `.env.example` to `.env` and fill in your values.

---

## UI Components (shadcn/ui)

- The frontend uses [shadcn/ui](https://ui.shadcn.com/docs) for reusable components.
- See `frontend/README.md` for how to add new components.

---

## Useful Links

- [Nx Documentation](https://nx.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright (e2e)](https://playwright.dev/)
- [Lucide Icons](https://lucide.dev/icons/)

---

## Contributing

- Open PRs for improvements or bugfixes.
- Please update relevant READMEs if you change project structure or conventions.
