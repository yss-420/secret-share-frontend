-- Create a simple security definer function for getting user stats
CREATE OR REPLACE FUNCTION public.get_my_stats()
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For authenticated users, get their stats based on auth.uid()
  IF auth.uid() IS NOT NULL THEN
    RETURN QUERY
    SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
    FROM public.users u
    WHERE u.telegram_id = (auth.uid()::text)::bigint;
  ELSE
    -- For anonymous users (like Telegram), we need a different approach
    -- Return empty result for now, will be called with specific telegram_id
    RETURN;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_my_stats() TO authenticated, anon;

-- Also create a function that takes telegram_id for Telegram auth
CREATE OR REPLACE FUNCTION public.get_user_stats_safe(p_telegram_id bigint)
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
  FROM public.users u
  WHERE u.telegram_id = p_telegram_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_stats_safe(bigint) TO authenticated, anon;