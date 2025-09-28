-- Critical Security Fixes: Secure user_status_public and add RLS to ad_sessions

-- First, let's secure the user_status_public view
-- Drop the existing view and replace with a secure one
DROP VIEW IF EXISTS public.user_status_public;

-- Create a secure view that requires authentication and only shows user's own data
CREATE VIEW public.user_status_public AS
SELECT 
  telegram_id,
  gems,
  messages_today,
  subscription_type
FROM public.users
WHERE telegram_id = (auth.uid()::text)::bigint;

-- Enable RLS on the view (though views inherit from underlying tables)
ALTER VIEW public.user_status_public SET (security_barrier = true);

-- Add comprehensive RLS policies for ad_sessions table
-- Enable RLS first
ALTER TABLE public.ad_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own ad sessions
CREATE POLICY "Users can view their own ad sessions" 
ON public.ad_sessions 
FOR SELECT 
USING (user_id = (auth.uid()::text)::bigint);

-- Policy: Users can only insert their own ad sessions
CREATE POLICY "Users can insert their own ad sessions" 
ON public.ad_sessions 
FOR INSERT 
WITH CHECK (user_id = (auth.uid()::text)::bigint);

-- Policy: Users can only update their own ad sessions
CREATE POLICY "Users can update their own ad sessions" 
ON public.ad_sessions 
FOR UPDATE 
USING (user_id = (auth.uid()::text)::bigint)
WITH CHECK (user_id = (auth.uid()::text)::bigint);

-- Policy: Service role has full access for backend operations
CREATE POLICY "Service role full access to ad sessions" 
ON public.ad_sessions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_ad_sessions_user_id ON public.ad_sessions(user_id);

-- Ensure the session_id field has a unique constraint for data integrity
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_sessions_session_id ON public.ad_sessions(session_id);