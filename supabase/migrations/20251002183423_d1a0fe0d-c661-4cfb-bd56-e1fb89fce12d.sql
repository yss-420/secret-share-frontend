-- Security fixes: Allow users to access their own data while maintaining service role access

-- 1. FIX USERS TABLE: Add policy for users to view their own data
-- Drop existing restrictive policy and recreate with proper access
DROP POLICY IF EXISTS "service_role_only" ON public.users;

-- Service role maintains full access
CREATE POLICY "Service role full access to users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users can view their own data by telegram_id
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO public
USING (telegram_id = ((auth.uid())::text)::bigint);

-- Users can update their own data (for session_data, last_seen, etc.)
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO public
USING (telegram_id = ((auth.uid())::text)::bigint)
WITH CHECK (telegram_id = ((auth.uid())::text)::bigint);


-- 2. FIX SUBSCRIPTIONS TABLE: Allow users to view their own subscriptions
DROP POLICY IF EXISTS "service_role_only" ON public.subscriptions;

-- Service role maintains full access
CREATE POLICY "Service role full access to subscriptions"
ON public.subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions
FOR SELECT
TO public
USING (user_id = ((auth.uid())::text)::bigint);


-- 3. FIX SUBSCRIPTION_TIERS TABLE: Allow authenticated users to view subscription tiers
DROP POLICY IF EXISTS "service_role_only" ON public.subscription_tiers;

-- Service role maintains full access
CREATE POLICY "Service role full access to subscription tiers"
ON public.subscription_tiers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- All authenticated users can view active subscription tiers
CREATE POLICY "Authenticated users can view subscription tiers"
ON public.subscription_tiers
FOR SELECT
TO public
USING (active = true);


-- 4. UPDATE DATABASE FUNCTIONS: Set proper search_path for security
ALTER FUNCTION public.get_recent_opponents(bigint, integer) SET search_path = public;
ALTER FUNCTION public.cleanup_old_sessions() SET search_path = public;
ALTER FUNCTION public.increment_user_messages(bigint) SET search_path = public;
ALTER FUNCTION public.log_voice_call(bigint, varchar, varchar, varchar, integer) SET search_path = public;
ALTER FUNCTION public.update_call_duration(varchar, integer) SET search_path = public;
ALTER FUNCTION public.penis_ratings_denorm() SET search_path = public;


-- Note: Views (conversations_view, v_user_active_subscription) inherit RLS from underlying tables
-- The conversations and subscriptions tables now have proper RLS, so the views are secure