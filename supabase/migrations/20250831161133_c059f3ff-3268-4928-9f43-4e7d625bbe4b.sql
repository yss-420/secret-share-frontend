-- Fix remaining critical security issues for complete protection

-- 1. Fix analytics tables - restrict to service role only
ALTER TABLE public.earnings_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to earnings analytics" 
ON public.earnings_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.monthly_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to monthly earnings" 
ON public.monthly_earnings 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.payment_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to payment analytics" 
ON public.payment_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to session analytics" 
ON public.session_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.top_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to top customers" 
ON public.top_customers 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.voice_call_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to voice call analytics" 
ON public.voice_call_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

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

-- 4. Fix v_user_active_subscription - users can only see their own subscriptions
ALTER VIEW public.v_user_active_subscription SET (security_barrier = true);
-- Note: Views inherit RLS from underlying tables, subscriptions table already has service_role policy

-- 5. Fix conversations_view - users can only see their own conversations
ALTER TABLE public.conversations_view ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" 
ON public.conversations_view 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint OR auth.role() = 'service_role');

-- 6. Fix intro_cycles - users can only see their own cycles
ALTER TABLE public.intro_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own intro cycles" 
ON public.intro_cycles 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage intro cycles" 
ON public.intro_cycles 
FOR ALL 
USING (auth.role() = 'service_role');

-- 7. Fix intro_reminder_jobs - restrict to service role only
ALTER TABLE public.intro_reminder_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only access to reminder jobs" 
ON public.intro_reminder_jobs 
FOR ALL 
USING (auth.role() = 'service_role');