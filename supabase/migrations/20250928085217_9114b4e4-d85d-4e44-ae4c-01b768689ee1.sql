-- Replace user_status_public view with a secure function approach
-- Drop the existing view
DROP VIEW public.user_status_public;

-- Create a secure function that only returns authenticated user's data
CREATE OR REPLACE FUNCTION public.get_user_status()
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return data for authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN QUERY
  SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
  FROM public.users u
  WHERE u.telegram_id = (auth.uid()::text)::bigint;
END;
$$;

-- Create a restricted view that uses the secure function
CREATE VIEW public.user_status_public 
WITH (security_barrier=true) AS
SELECT * FROM public.get_user_status();

-- Grant execute permission only to authenticated users
REVOKE ALL ON FUNCTION public.get_user_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_status() TO service_role;