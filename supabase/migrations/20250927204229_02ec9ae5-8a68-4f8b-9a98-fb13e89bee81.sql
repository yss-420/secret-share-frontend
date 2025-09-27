-- Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS public.get_payment_analytics(integer);
DROP FUNCTION IF EXISTS public.get_earnings_analytics();
DROP FUNCTION IF EXISTS public.get_monthly_earnings();
DROP FUNCTION IF EXISTS public.get_session_analytics();
DROP FUNCTION IF EXISTS public.get_top_customers(integer);
DROP FUNCTION IF EXISTS public.get_voice_call_analytics();

-- Drop any existing views as well
DROP VIEW IF EXISTS public.earnings_analytics;
DROP VIEW IF EXISTS public.monthly_earnings;
DROP VIEW IF EXISTS public.payment_analytics;
DROP VIEW IF EXISTS public.session_analytics;
DROP VIEW IF EXISTS public.top_customers;
DROP VIEW IF EXISTS public.voice_call_analytics;

-- Create security definer functions that require service role access
-- Only authorized users/services can access analytics data

CREATE OR REPLACE FUNCTION public.get_earnings_analytics()
RETURNS TABLE(
  date date,
  total_transactions bigint,
  unique_customers bigint,
  stars_earned bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    se.created_at::date as date,
    COUNT(*)::bigint as total_transactions,
    COUNT(DISTINCT se.user_id)::bigint as unique_customers,
    COALESCE(SUM(se.stars_amount), 0)::bigint as stars_earned
  FROM public.star_earnings se
  WHERE se.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY se.created_at::date
  ORDER BY date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_earnings()
RETURNS TABLE(
  month timestamp with time zone,
  total_transactions bigint,
  unique_customers bigint,
  total_stars bigint,
  avg_transaction_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    date_trunc('month', se.created_at) as month,
    COUNT(*)::bigint as total_transactions,
    COUNT(DISTINCT se.user_id)::bigint as unique_customers,
    COALESCE(SUM(se.stars_amount), 0)::bigint as total_stars,
    COALESCE(AVG(se.stars_amount), 0) as avg_transaction_value
  FROM public.star_earnings se
  GROUP BY date_trunc('month', se.created_at)
  ORDER BY month DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_payment_analytics_secure(p_days integer DEFAULT 30)
RETURNS TABLE(
  payment_date date,
  total_payments bigint,
  successful_payments bigint,
  failed_payments bigint,
  revenue_stars bigint,
  unique_paying_users bigint,
  avg_payment_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    pp.created_at::date as payment_date,
    COUNT(*)::bigint as total_payments,
    COUNT(*) FILTER (WHERE pp.status = 'completed')::bigint as successful_payments,
    COUNT(*) FILTER (WHERE pp.status = 'failed')::bigint as failed_payments,
    COALESCE(SUM(pp.amount) FILTER (WHERE pp.status = 'completed'), 0)::bigint as revenue_stars,
    COUNT(DISTINCT pp.user_id) FILTER (WHERE pp.status = 'completed')::bigint as unique_paying_users,
    COALESCE(AVG(pp.amount) FILTER (WHERE pp.status = 'completed'), 0) as avg_payment_amount
  FROM public.processed_payments pp
  WHERE pp.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY pp.created_at::date
  ORDER BY payment_date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_session_analytics()
RETURNS TABLE(
  total_users bigint,
  users_with_sessions bigint,
  avg_hours_since_last_seen numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE u.session_data IS NOT NULL)::bigint as users_with_sessions,
    COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - u.last_seen))/3600), 0) as avg_hours_since_last_seen
  FROM public.users u;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_top_customers_secure(p_limit integer DEFAULT 10)
RETURNS TABLE(
  telegram_id bigint,
  username text,
  total_stars_spent bigint,
  total_purchases bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    u.telegram_id,
    u.username,
    COALESCE(SUM(se.stars_amount), 0)::bigint as total_stars_spent,
    COUNT(se.id)::bigint as total_purchases
  FROM public.users u
  LEFT JOIN public.star_earnings se ON u.telegram_id = se.user_id
  GROUP BY u.telegram_id, u.username
  HAVING COUNT(se.id) > 0
  ORDER BY total_stars_spent DESC
  LIMIT p_limit;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_voice_call_analytics()
RETURNS TABLE(
  telegram_id bigint,
  username text,
  user_name text,
  total_calls bigint,
  total_duration_minutes bigint,
  total_gems_spent bigint,
  avg_call_duration numeric,
  last_call_date timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to access analytics
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Analytics data requires service role access';
  END IF;

  RETURN QUERY
  SELECT 
    u.telegram_id,
    u.username,
    u.user_name,
    COUNT(vc.id)::bigint as total_calls,
    COALESCE(SUM(vc.duration_minutes), 0)::bigint as total_duration_minutes,
    COALESCE(SUM(vc.gem_cost), 0)::bigint as total_gems_spent,
    COALESCE(AVG(vc.duration_minutes), 0) as avg_call_duration,
    MAX(vc.created_at) as last_call_date
  FROM public.users u
  LEFT JOIN public.voice_calls vc ON u.telegram_id = vc.user_id
  GROUP BY u.telegram_id, u.username, u.user_name
  HAVING COUNT(vc.id) > 0
  ORDER BY total_gems_spent DESC;
END;
$$;