# Deploy & Build

Quick steps to build and deploy the app:

1. Install dependencies:

```bash
pnpm install
# or
npm install
```

2. Provide environment variables in `.env` (see `.env.example` if present). Important vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD` (for local admin access; prefer using auth + profiles in production)

3. Build production bundle:

```bash
npm run build
```

4. Serve the `dist/` output via your hosting provider (Netlify, Vercel, static server). If using server-side rendering or APIs, ensure server uses the Supabase Service Role for writes.

5. Database migrations: apply SQL files in `supabase/migrations/` to your Supabase project.

CI / GitHub Actions:

You can apply migrations automatically using the included GitHub Action. Set the repository secret `SUPABASE_DB_URL` to your Supabase Postgres connection string (use read/write credentials or a CI-only token).

Trigger workflow: `Actions` → `Apply Supabase Migrations` → `Run workflow` (or push to `main`).

