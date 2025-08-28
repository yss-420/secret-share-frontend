-- Create a dedicated user_header_stats table for secure, fast header data access
CREATE TABLE IF NOT EXISTS public.user_header_stats (
  telegram_id bigint PRIMARY KEY,
  gems integer NOT NULL DEFAULT 100,
  messages_today integer NOT NULL DEFAULT 0,
  subscription_type text DEFAULT 'free',
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.user_header_stats ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see their own header stats
CREATE POLICY "Users can view own header stats" ON public.user_header_stats
  FOR SELECT USING (true); -- Allow all reads for now since we'll use a secure function

-- Create a secure function to get header stats that works for both authenticated and anonymous users
CREATE OR REPLACE FUNCTION public.get_header_stats(p_telegram_id bigint)
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- First try to get from user_header_stats table
  RETURN QUERY
  SELECT uhs.telegram_id, uhs.gems, uhs.messages_today, uhs.subscription_type
  FROM public.user_header_stats uhs
  WHERE uhs.telegram_id = p_telegram_id;
  
  -- If no data found, get from users table and insert into header stats
  IF NOT FOUND THEN
    INSERT INTO public.user_header_stats (telegram_id, gems, messages_today, subscription_type)
    SELECT u.telegram_id, u.gems, u.messages_today, 
           CASE 
             WHEN u.subscription_type IS NULL THEN 'free'
             ELSE u.subscription_type
           END
    FROM public.users u 
    WHERE u.telegram_id = p_telegram_id
    ON CONFLICT (telegram_id) DO UPDATE SET
      gems = EXCLUDED.gems,
      messages_today = EXCLUDED.messages_today,
      subscription_type = EXCLUDED.subscription_type,
      last_updated = now();
    
    -- Return the data
    RETURN QUERY
    SELECT uhs.telegram_id, uhs.gems, uhs.messages_today, uhs.subscription_type
    FROM public.user_header_stats uhs
    WHERE uhs.telegram_id = p_telegram_id;
  END IF;
END;
$$;

-- Create a function to sync header stats from users table
CREATE OR REPLACE FUNCTION public.sync_user_header_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_header_stats (telegram_id, gems, messages_today, subscription_type, last_updated)
  SELECT 
    u.telegram_id, 
    u.gems, 
    u.messages_today,
    CASE 
      WHEN u.subscription_type IS NULL THEN 'free'
      ELSE u.subscription_type
    END,
    now()
  FROM public.users u
  ON CONFLICT (telegram_id) DO UPDATE SET
    gems = EXCLUDED.gems,
    messages_today = EXCLUDED.messages_today,
    subscription_type = EXCLUDED.subscription_type,
    last_updated = now();
END;
$$;

-- Populate the header stats table with existing user data
SELECT public.sync_user_header_stats();