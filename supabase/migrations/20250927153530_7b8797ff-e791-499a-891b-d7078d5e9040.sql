-- Fix security issues by adding proper RLS policies to tables only (not views)

-- 1. Enable RLS and add policies for ad_events table
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ad events" ON public.ad_events
FOR SELECT USING (user_id = ((auth.uid())::text)::bigint);

CREATE POLICY "Users can insert their own ad events" ON public.ad_events  
FOR INSERT WITH CHECK (user_id = ((auth.uid())::text)::bigint);

CREATE POLICY "Service role full access to ad events" ON public.ad_events
FOR ALL USING (auth.role() = 'service_role'::text);

-- 2. Enable RLS and add policies for penis_ratings table (adult content - restrict access)
ALTER TABLE public.penis_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ratings" ON public.penis_ratings
FOR SELECT USING (user_id = ((auth.uid())::text)::bigint);

CREATE POLICY "Users can insert their own ratings" ON public.penis_ratings
FOR INSERT WITH CHECK (user_id = ((auth.uid())::text)::bigint);

CREATE POLICY "Service role full access to ratings" ON public.penis_ratings
FOR ALL USING (auth.role() = 'service_role'::text);

-- 3. Enable RLS for rating_cache (related to penis_ratings)
ALTER TABLE public.rating_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only access to rating cache" ON public.rating_cache
FOR ALL USING (auth.role() = 'service_role'::text);

-- Note: Views (earnings_analytics, payment_analytics, monthly_earnings, session_analytics, 
-- top_customers, voice_call_analytics, user_status_public, user_window_caps, 
-- v_user_active_subscription) cannot have RLS applied directly. 
-- Their security depends on the underlying tables they query from.