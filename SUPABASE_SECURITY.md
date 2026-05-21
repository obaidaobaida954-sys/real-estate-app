# Supabase Security & RLS Guidance

This project ships with SQL migrations under `supabase/migrations/`.

Recommended steps for production:

1. Use the Supabase **Service Role** key for any server-side writes (secrets in backend only).
2. Enable Row Level Security (RLS) on tables (already enabled in migrations).
3. Use the provided `20260517_rls_admin_policy.sql` migration to allow writes only for authenticated admin users.
4. Create a `profiles` table linked to `auth.users` and set `is_admin = true` for admin accounts.

Example `profiles` snippet (run in Supabase SQL):

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  is_admin boolean DEFAULT false
);
```

5. To perform server-side maintenance, use the service role key (do NOT embed it in client-side code).
6. Review policies carefully before enabling in production. The migration `20260517_harden_rls.sql` provides a deny-by-default starting point.

