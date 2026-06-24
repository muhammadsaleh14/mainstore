# MainStore Admin

Admin dashboard for the MainStore API. Built with Vite + React + TypeScript.

## Stack

| Concern | Tool |
|---------|------|
| UI components | Ant Design v6 (`antd`) |
| Server state | TanStack Query (`@tanstack/react-query`) |
| Client/UI state | Zustand (sidebar, theme) |
| Routing | React Router |
| HTTP | Axios (with Clerk token injection) |
| Auth | Clerk (`@clerk/clerk-react`), gated to the `admin` role |

State is **hybrid**: server data lives in React Query; local UI state (sidebar, theme) lives in Zustand.

## Project structure

```
src/
  config/        # env access
  lib/           # axios client, query client
  stores/        # zustand stores (UI state)
  types/         # shared API types
  components/    # shared components (guards, layout helpers)
  layouts/       # DashboardLayout (sider + header)
  routes/        # router definition
  features/      # feature modules (hybrid: each owns api/hooks/pages)
    auth/
    dashboard/
    products/
    users/
```

Each feature folder owns its `api/` (HTTP calls), `hooks/` (React Query), and `pages/` (screens). Shared concerns live in the top-level layers.

## Setup

1. Install dependencies:

   ```txt
   npm install
   ```

2. Copy the env template and fill in values:

   ```txt
   copy .env.example .env
   ```

   - `VITE_API_URL` — your Hono Worker URL (default `http://localhost:8787`)
   - `VITE_CLERK_PUBLISHABLE_KEY` — from the Clerk dashboard (API Keys)

3. Start the dev server:

   ```txt
   npm run dev
   ```

   Open http://localhost:5173

## Access

The dashboard requires a Clerk account whose Neon `users.role` is `admin`. See the server README ("Step 4: Roles") for how to promote your first admin. Non-admins see an "Access denied" screen.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |
