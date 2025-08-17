-- Fix RLS policies for user data access
-- Allow anon users to read from users table for basic user stats
CREATE POLICY "Allow anon read access to user stats" ON public.users
FOR SELECT 
USING (true);

-- Also ensure the user_status_public view has proper permissions
GRANT SELECT ON public.user_status_public TO anon, authenticated;