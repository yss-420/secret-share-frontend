-- Fix the remaining function without search path set
CREATE OR REPLACE FUNCTION public.update_processed_payments_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Drop all remaining analytics views and recreate them as regular views
DROP VIEW IF EXISTS public.earnings_analytics CASCADE;
DROP VIEW IF EXISTS public.monthly_earnings CASCADE;
DROP VIEW IF EXISTS public.payment_analytics CASCADE; 
DROP VIEW IF EXISTS public.top_customers CASCADE;

-- Recreate analytics views as regular views (not security definer)
CREATE VIEW public.earnings_analytics AS
SELECT 
  date_trunc('day', se.created_at)::date as date,
  SUM(se.stars_amount) as stars_earned,
  SUM(CASE WHEN se.payment_type = 'gems' THEN se.stars_amount ELSE 0 END) as gems_revenue,
  SUM(CASE WHEN se.payment_type = 'subscription' THEN se.stars_amount ELSE 0 END) as subscription_revenue,
  COUNT(*) as total_transactions,
  COUNT(DISTINCT se.user_id) as unique_customers
FROM public.star_earnings se
GROUP BY date_trunc('day', se.created_at)
ORDER BY date DESC;

CREATE VIEW public.monthly_earnings AS
SELECT 
  date_trunc('month', se.created_at) as month,
  SUM(se.stars_amount) as total_stars,
  COUNT(*) as total_transactions,
  COUNT(DISTINCT se.user_id) as unique_customers,
  AVG(se.stars_amount) as avg_transaction_value
FROM public.star_earnings se
GROUP BY date_trunc('month', se.created_at)
ORDER BY month DESC;

CREATE VIEW public.payment_analytics AS
SELECT 
  date_trunc('day', pp.created_at)::date as payment_date,
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE pp.status = 'completed') as successful_payments,
  COUNT(*) FILTER (WHERE pp.status = 'failed') as failed_payments,
  COUNT(DISTINCT pp.user_id) as unique_paying_users,
  SUM(CASE WHEN pp.status = 'completed' THEN pp.amount ELSE 0 END) as revenue_stars,
  AVG(CASE WHEN pp.status = 'completed' THEN pp.amount ELSE NULL END) as avg_payment_amount
FROM public.processed_payments pp
GROUP BY date_trunc('day', pp.created_at)
ORDER BY payment_date DESC;

CREATE VIEW public.top_customers AS
SELECT 
  u.telegram_id,
  u.username,
  u.user_name,
  COUNT(*) as total_purchases,
  SUM(pp.amount) as total_stars_spent,
  MAX(pp.created_at) as last_purchase_date
FROM public.processed_payments pp
JOIN public.users u ON u.telegram_id = pp.user_id
WHERE pp.status = 'completed'
GROUP BY u.telegram_id, u.username, u.user_name
ORDER BY total_stars_spent DESC
LIMIT 100;