-- RLS policies to allow writes only for admin users or service role
-- Assumes you have a `profiles` table linked to `auth.users` with an `is_admin` boolean column.
-- If you don't have a profiles table, create one and populate `is_admin` for admins.

-- Example profiles table (run once in a migration if needed):
-- CREATE TABLE IF NOT EXISTS profiles (
--   id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
--   full_name text,
--   is_admin boolean DEFAULT false
-- );

-- Allow properties writes only if the authenticated user is admin
DROP POLICY IF EXISTS "Deny client write on properties" ON properties;
CREATE POLICY "Allow admin writes on properties" ON properties
  FOR ALL
  USING (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  WITH CHECK (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Allow notifications insert by admin
DROP POLICY IF EXISTS "Deny client insert on notifications" ON notifications;
CREATE POLICY "Allow admin insert on notifications" ON notifications
  FOR INSERT
  WITH CHECK (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Allow contact_info writes by admin
DROP POLICY IF EXISTS "Deny client write on contact_info" ON contact_info;
CREATE POLICY "Allow admin writes on contact_info" ON contact_info
  FOR ALL
  USING (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  WITH CHECK (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Important: For server-side service role operations (safe in CI/CD or backend), use the Supabase Service Role key. The service role bypasses RLS.
-- To allow only server-side writes and block client entirely, you can instead DROP the admin policies above and rely on server-side keys.
