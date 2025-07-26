-- Fix the remaining function with mutable search path
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  UPDATE public.users 
  SET session_data = NULL 
  WHERE last_seen < NOW() - INTERVAL '7 days' 
  AND session_data IS NOT NULL;
END;
$function$;

-- Remove security definer from analytics views (they should be accessible to authorized users only)
DROP VIEW IF EXISTS public.conversations_view;
CREATE VIEW public.conversations_view AS
SELECT 
  id,
  created_at,
  bot_response,
  user_message,
  character,
  user_id
FROM public.conversations;

DROP VIEW IF EXISTS public.session_analytics;
CREATE VIEW public.session_analytics AS
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE session_data IS NOT NULL) as users_with_sessions,
  AVG(EXTRACT(EPOCH FROM (NOW() - last_seen))/3600) as avg_hours_since_last_seen
FROM public.users;

DROP VIEW IF EXISTS public.voice_call_analytics;
CREATE VIEW public.voice_call_analytics AS
SELECT 
  vc.user_id as telegram_id,
  u.username,
  u.user_name,
  COUNT(*) as total_calls,
  SUM(vc.duration_minutes) as total_duration_minutes,
  AVG(vc.duration_minutes) as avg_call_duration,
  SUM(vc.gem_cost) as total_gems_spent,
  MAX(vc.created_at) as last_call_date
FROM public.voice_calls vc
JOIN public.users u ON u.telegram_id = vc.user_id
GROUP BY vc.user_id, u.username, u.user_name;

-- Enable RLS on the remaining analytics tables if they exist
ALTER TABLE public.gem_packages ENABLE ROW LEVEL SECURITY;

-- Create policy for gem_packages (public read access)
CREATE POLICY "Gem packages are publicly readable"
ON public.gem_packages
FOR SELECT
USING (true);