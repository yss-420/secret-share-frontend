-- Phase 1: Fix Conversations View (CRITICAL)
-- Drop the insecure view that doesn't enforce RLS
DROP VIEW IF EXISTS public.conversations_view;

-- Create a security definer function that respects RLS
CREATE OR REPLACE FUNCTION public.get_user_conversations(p_user_id bigint DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  user_id bigint,
  "character" text,
  user_message text,
  bot_response text,
  created_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user_id provided, return only that user's conversations (must match auth.uid)
  -- Otherwise, return authenticated user's conversations
  IF p_user_id IS NOT NULL THEN
    RETURN QUERY
    SELECT c.id, c.user_id, c."character", c.user_message, c.bot_response, c.created_at
    FROM public.conversations c
    WHERE c.user_id = p_user_id AND p_user_id = ((auth.uid())::text)::bigint;
  ELSE
    RETURN QUERY
    SELECT c.id, c.user_id, c."character", c.user_message, c.bot_response, c.created_at
    FROM public.conversations c
    WHERE c.user_id = ((auth.uid())::text)::bigint;
  END IF;
END;
$$;

-- Phase 2: Fix Delivered Media Policy (MEDIUM)
-- Replace the custom JWT parsing with standard auth.uid()
DROP POLICY IF EXISTS "delivered_media_self_read" ON public.delivered_media;

CREATE POLICY "Users can view own delivered media"
ON public.delivered_media
FOR SELECT
TO public
USING (user_id = ((auth.uid())::text)::bigint);

-- Phase 5: Clean up redundant policies on conversations table
-- The table already has proper RLS policies, but let's ensure they're optimal
-- Verify service role access is comprehensive
DROP POLICY IF EXISTS "Allow service role all access" ON public.conversations;
DROP POLICY IF EXISTS "Service role conversations access" ON public.conversations;

-- Single comprehensive service role policy
CREATE POLICY "Service role full access to conversations"
ON public.conversations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);