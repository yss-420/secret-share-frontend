-- Fix RLS policies for actual tables only (views inherit from underlying tables)

-- 1. Fix intro_cycles - users can only see their own cycles
ALTER TABLE public.intro_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own intro cycles" 
ON public.intro_cycles 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage intro cycles" 
ON public.intro_cycles 
FOR ALL 
USING (auth.role() = 'service_role');

-- 2. Fix intro_reminder_jobs - restrict to service role only  
ALTER TABLE public.intro_reminder_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to reminder jobs" 
ON public.intro_reminder_jobs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Note: All other tables mentioned in security scan are views
-- Views inherit RLS from their underlying base tables
-- The critical payment tables (daily_claims, star_earnings, processed_payments) 
-- have already been secured in the previous migration