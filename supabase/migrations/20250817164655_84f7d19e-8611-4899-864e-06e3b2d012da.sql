-- Drop existing conflicting policies on users table
DROP POLICY IF EXISTS "Allow users to read their own data via telegram_id" ON public.users;
DROP POLICY IF EXISTS "Allow anon read access to user stats" ON public.users;
DROP POLICY IF EXISTS "Users can update own session data" ON public.users;

-- Create a single, simple policy for public read access to user stats
CREATE POLICY "Public read access for user stats" ON public.users
FOR SELECT
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;