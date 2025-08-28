-- Create a simple test function that always works
CREATE OR REPLACE FUNCTION public.test_header_stats()
RETURNS TABLE(telegram_id bigint, gems integer, messages_today integer, subscription_type text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 999999999::bigint, 500, 10, 'premium'::text;
$$;

-- Make sure anyone can call header stats functions
GRANT EXECUTE ON FUNCTION public.get_header_stats(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.test_header_stats() TO anon, authenticated;