-- Fix RLS policies for payment-related tables that are currently publicly readable

-- 1. Fix daily_claims table - should only allow users to see their own claims
DROP POLICY IF EXISTS "Users can view their own daily claims" ON public.daily_claims;
CREATE POLICY "Users can view their own daily claims" 
ON public.daily_claims 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint);

-- 2. Fix star_earnings table - should only allow users to see their own earnings
DROP POLICY IF EXISTS "Users can view their own earnings" ON public.star_earnings;
CREATE POLICY "Users can view their own earnings" 
ON public.star_earnings 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint);

-- 3. Fix processed_payments table - should only allow users to see their own payments
DROP POLICY IF EXISTS "Users can view their own payments" ON public.processed_payments;
CREATE POLICY "Users can view their own payments" 
ON public.processed_payments 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint);

-- Note: gem_packages stays public as it contains pricing information that users need to see