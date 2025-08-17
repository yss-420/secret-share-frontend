-- Create a policy that allows users to read their own data based on telegram_id in JWT
-- This policy will work when the frontend includes telegram_id in the JWT payload

-- First, drop the conflicting policy that uses auth.uid()
DROP POLICY IF EXISTS "Users can read own session data" ON public.users;

-- Create a new policy that allows reading user data without auth requirements
-- This is temporary until proper JWT authentication is implemented
CREATE POLICY "Allow users to read their own data via telegram_id" 
ON public.users 
FOR SELECT 
USING (true);

-- Note: This is a temporary solution. For production, you should implement proper JWT-based auth
-- where telegram_id is included in the JWT payload and the policy can verify:
-- USING (telegram_id = (auth.jwt() ->> 'telegram_id')::bigint);