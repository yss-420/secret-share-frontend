-- COMPREHENSIVE SECURITY FIX - Address all remaining vulnerabilities
-- This migration secures all exposed views and tables

-- ============================================================================
-- CRITICAL FIX 1: Block anonymous access to users table
-- ============================================================================
-- The users table currently allows service_role but doesn't explicitly block anonymous access
-- Add a policy to deny all anonymous access
CREATE POLICY "Block anonymous access to users table"
ON public.users
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- ============================================================================
-- CRITICAL FIX 2: Secure user_window_caps view
-- ============================================================================
-- This view exposes user activity patterns - needs to be replaced with secure function
DROP VIEW IF EXISTS public.user_window_caps CASCADE;

-- Create secure function to get user window caps (only own data)
CREATE OR REPLACE FUNCTION public.get_user_window_caps_secure(p_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  user_id uuid,
  username text,
  last_seen timestamp with time zone,
  message_window_started_at timestamp with time zone,
  message_window_index integer,
  bonus_messages_in_window integer,
  messages_today integer,
  base_cap integer,
  effective_cap integer,
  hit_cap boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return data for authenticated user
  IF p_user_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      u.id::uuid,
      u.username,
      u.last_seen,
      u.message_window_started_at,
      u.message_window_index,
      u.bonus_messages_in_window,
      u.messages_today,
      10 as base_cap,
      (10 + u.bonus_messages_in_window) as effective_cap,
      (u.messages_today >= (10 + u.bonus_messages_in_window)) as hit_cap
    FROM public.users u
    WHERE u.id = p_user_id AND p_user_id = auth.uid();
  ELSE
    RETURN QUERY
    SELECT 
      u.id::uuid,
      u.username,
      u.last_seen,
      u.message_window_started_at,
      u.message_window_index,
      u.bonus_messages_in_window,
      u.messages_today,
      10 as base_cap,
      (10 + u.bonus_messages_in_window) as effective_cap,
      (u.messages_today >= (10 + u.bonus_messages_in_window)) as hit_cap
    FROM public.users u
    WHERE u.id = auth.uid();
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_window_caps_secure(uuid) TO authenticated;

-- Recreate view with security barrier (for backward compatibility)
CREATE VIEW public.user_window_caps
WITH (security_barrier=true) AS
SELECT * FROM public.get_user_window_caps_secure(NULL);

-- ============================================================================
-- WARNING FIX 3: Secure v_user_active_subscription view
-- ============================================================================
-- Replace with security definer function
DROP VIEW IF EXISTS public.v_user_active_subscription CASCADE;

CREATE OR REPLACE FUNCTION public.get_active_subscription_secure(p_user_id bigint DEFAULT NULL)
RETURNS TABLE (
  subscription_id bigint,
  user_id bigint,
  tier_id text,
  tier_name text,
  status text,
  is_recurring boolean,
  current_period_end timestamp with time zone,
  next_renewal_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return authenticated user's subscription
  IF p_user_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      s.id,
      s.user_id,
      s.tier_id,
      t.display_name,
      s.status::text,
      s.is_recurring,
      s.current_period_end,
      s.next_renewal_at
    FROM public.subscriptions s
    LEFT JOIN public.subscription_tiers t ON s.tier_id = t.id
    WHERE s.user_id = p_user_id 
      AND s.status = 'active'
      AND p_user_id = ((auth.uid())::text)::bigint;
  ELSE
    RETURN QUERY
    SELECT 
      s.id,
      s.user_id,
      s.tier_id,
      t.display_name,
      s.status::text,
      s.is_recurring,
      s.current_period_end,
      s.next_renewal_at
    FROM public.subscriptions s
    LEFT JOIN public.subscription_tiers t ON s.tier_id = t.id
    WHERE s.user_id = ((auth.uid())::text)::bigint
      AND s.status = 'active';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_active_subscription_secure(bigint) TO authenticated;

-- Recreate view with security barrier
CREATE VIEW public.v_user_active_subscription
WITH (security_barrier=true) AS
SELECT * FROM public.get_active_subscription_secure(NULL);

-- ============================================================================
-- INFO: Leaderboard is intentionally public but could be improved
-- ============================================================================
-- The willy_leaderboard is public by design for competitive features
-- Consider adding a policy to only show anonymized data or champion_name instead of exposing user_id
-- For now, this is documented as a design decision but can be revisited

-- ============================================================================
-- VERIFICATION: Ensure all user tables have proper RLS
-- ============================================================================
-- Double-check that RLS is enabled on all critical tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

COMMENT ON POLICY "Block anonymous access to users table" ON public.users IS 
'Prevents anonymous users from accessing any user data. Only authenticated users can view their own data, and service_role has full access.';