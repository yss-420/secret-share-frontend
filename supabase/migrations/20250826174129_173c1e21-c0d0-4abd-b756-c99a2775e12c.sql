-- Fix RLS policies for user_status_public to allow users to see their own stats
DROP POLICY IF EXISTS "Users can view their own status" ON public.user_status_public;
CREATE POLICY "Users can view their own status" ON public.user_status_public
FOR SELECT USING (
  telegram_id = ((auth.uid())::text)::bigint
);

-- Enable RLS on user_status_public if not already enabled
ALTER TABLE public.user_status_public ENABLE ROW LEVEL SECURITY;

-- Fix conversations table RLS policies - remove overly permissive policies
DROP POLICY IF EXISTS "Allow service role all access" ON public.conversations;
DROP POLICY IF EXISTS "Service role conversations access" ON public.conversations;

-- Add proper RLS policy for conversations - users can only see their own conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" ON public.conversations
FOR SELECT USING (
  user_id = ((auth.uid())::text)::bigint
);

-- Add service role access for conversations (more restrictive)
CREATE POLICY "Service role can manage conversations" ON public.conversations
FOR ALL USING (
  auth.role() = 'service_role'
);

-- Fix chats table RLS - ensure users can only access their own chats
-- Update existing policy to be more secure
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
CREATE POLICY "Users can view their own chats" ON public.chats
FOR SELECT USING (
  telegram_id = ((auth.uid())::text)::bigint
);

-- Fix relationships table RLS - ensure users can only access their own relationships
-- The existing policies look correct, but let's make sure they're properly secured
DROP POLICY IF EXISTS "Users can view their own relationships" ON public.relationships;
CREATE POLICY "Users can view their own relationships" ON public.relationships
FOR SELECT USING (
  user_id = auth.uid()
);