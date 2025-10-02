-- Fix user_status_public security issue (CRITICAL)
-- Views don't enforce RLS properly - replace with security definer function

-- Drop the insecure view
DROP VIEW IF EXISTS public.user_status_public;

-- Create a secure function that only returns the authenticated user's status
-- This replaces the view and enforces proper access control
CREATE OR REPLACE FUNCTION public.get_user_status_secure(p_telegram_id bigint DEFAULT NULL)
RETURNS TABLE (
  telegram_id bigint,
  gems integer,
  messages_today integer,
  subscription_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If telegram_id is provided, verify it matches the authenticated user
  -- Otherwise, return authenticated user's status
  IF p_telegram_id IS NOT NULL THEN
    -- Only return data if the requested ID matches the authenticated user
    RETURN QUERY
    SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
    FROM public.users u
    WHERE u.telegram_id = p_telegram_id 
      AND p_telegram_id = ((auth.uid())::text)::bigint;
  ELSE
    -- Return authenticated user's status
    RETURN QUERY
    SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
    FROM public.users u
    WHERE u.telegram_id = ((auth.uid())::text)::bigint;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_user_status_secure(bigint) TO authenticated;

-- For backward compatibility, create a secure view that uses the function
-- This view will only show the current user's data
CREATE VIEW public.user_status_public 
WITH (security_barrier=true) AS
SELECT * FROM public.get_user_status_secure(NULL);

-- Note: The underlying 'users' table already has RLS enabled which provides
-- an additional layer of security. This function approach ensures no data leakage.