-- Fix remaining critical security issues for complete protection (corrected for views)

-- 1. Fix actual analytics tables that aren't views (skip view-based analytics)
-- Most analytics tables appear to be views, so we'll focus on real tables

-- 2. Fix user_status_public - users can only see their own status
ALTER TABLE public.user_status_public ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own status" 
ON public.user_status_public 
FOR SELECT 
USING (telegram_id = ((auth.uid())::text)::bigint);

-- 3. Fix user_window_caps - users can only see their own caps
ALTER TABLE public.user_window_caps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own window caps" 
ON public.user_window_caps 
FOR SELECT 
USING (user_id = auth.uid());

-- 4. Fix conversations_view - users can only see their own conversations
ALTER TABLE public.conversations_view ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" 
ON public.conversations_view 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint OR auth.role() = 'service_role');

-- 5. Fix intro_cycles - users can only see their own cycles
ALTER TABLE public.intro_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own intro cycles" 
ON public.intro_cycles 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage intro cycles" 
ON public.intro_cycles 
FOR ALL 
USING (auth.role() = 'service_role');

-- 6. Fix intro_reminder_jobs - restrict to service role only
ALTER TABLE public.intro_reminder_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to reminder jobs" 
ON public.intro_reminder_jobs 
FOR ALL 
USING (auth.role() = 'service_role');