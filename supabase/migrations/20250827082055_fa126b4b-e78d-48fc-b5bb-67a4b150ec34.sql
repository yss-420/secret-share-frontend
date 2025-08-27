-- Drop the current view
DROP VIEW IF EXISTS public.user_status_public;

-- Create a security definer function that users can call to get their own stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_telegram_id bigint)
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to get their own stats or service role to get any stats
  IF auth.role() != 'service_role' AND p_telegram_id != (auth.uid()::text)::bigint THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT u.telegram_id, u.gems, u.messages_today, u.subscription_type
  FROM public.users u
  WHERE u.telegram_id = p_telegram_id;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_user_stats(bigint) TO authenticated, anon;

-- Create a new view using the security definer function approach
CREATE VIEW public.user_status_public AS
SELECT 
  telegram_id,
  gems, 
  messages_today,
  subscription_type
FROM public.users
WHERE telegram_id = (auth.uid()::text)::bigint;

-- Enable RLS on the view
ALTER VIEW public.user_status_public ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see the view
CREATE POLICY "Users can view user_status_public" 
ON public.user_status_public 
FOR SELECT 
USING (true);

-- Grant select permission on the view
GRANT SELECT ON public.user_status_public TO authenticated, anon;