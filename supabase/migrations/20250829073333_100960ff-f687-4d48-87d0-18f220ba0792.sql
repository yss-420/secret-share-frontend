-- Drop the user_header_stats table as it's no longer needed
DROP TABLE IF EXISTS public.user_header_stats;

-- Drop the related functions that are no longer needed
DROP FUNCTION IF EXISTS public.get_header_stats(bigint);
DROP FUNCTION IF EXISTS public.sync_user_header_stats();
DROP FUNCTION IF EXISTS public.test_header_stats();