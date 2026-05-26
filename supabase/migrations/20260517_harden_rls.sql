-- Harden RLS: disallow client-side writes by default
-- This migration replaces permissive write policies with deny-by-default policies.
-- Customize these policies to allow server-side/service-role writes or authenticated admin users.

-- Properties: deny inserts/updates/deletes from client
DROP POLICY IF EXISTS "Allow insert on properties" ON properties;
DROP POLICY IF EXISTS "Allow delete on properties" ON properties;
DROP POLICY IF EXISTS "Allow update on properties" ON properties;

CREATE POLICY "Deny client write on properties" ON properties
  FOR ALL USING (true)
  WITH CHECK (false);

-- Notifications: deny client inserts
DROP POLICY IF EXISTS "Allow insert on notifications" ON notifications;
CREATE POLICY "Deny client insert on notifications" ON notifications
  FOR INSERT WITH CHECK (false);

-- Contact info: deny client writes
DROP POLICY IF EXISTS "Allow insert on contact_info" ON contact_info;
DROP POLICY IF EXISTS "Allow update on contact_info" ON contact_info;

CREATE POLICY "Deny client write on contact_info" ON contact_info
  FOR ALL USING (true)
  WITH CHECK (false);

-- Notes:
-- 1) For server-side operations, use the Supabase Service Role key from a trusted environment.
-- 2) To allow authenticated admin users, create policies like:
--    CREATE POLICY "Admin writes" ON properties
--      FOR ALL USING (exists(SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin))
--      WITH CHECK (exists(SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin));
-- 3) Adjust the above to match your auth/users schema.
