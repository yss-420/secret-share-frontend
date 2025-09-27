-- Fix search_path security issues for functions that are missing proper search_path settings

-- Fix process_daily_return_bonus function
CREATE OR REPLACE FUNCTION public.process_daily_return_bonus(p_user_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare
  now_utc timestamptz := timezone('utc', now());
  u record;
  today_date date := (now_utc)::date;
  hours_since_last_seen numeric;
  day_in_cycle integer;
  reward_amount integer := 0;
  reward_type text := null;
  new_streak integer;
  inserted boolean := false;
begin
  select telegram_id, gems, last_seen, last_daily_claim_at, coalesce(streak_count,0) as streak_count
  into u
  from public.users
  where telegram_id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('awarded', false, 'reason', 'user_not_found');
  end if;

  if u.last_seen is null then
    return jsonb_build_object('awarded', false, 'reason', 'no_prior_activity');
  end if;

  hours_since_last_seen := extract(epoch from (now_utc - u.last_seen)) / 3600.0;

  -- Missed 24h window: reset streak, no award
  if hours_since_last_seen > 24.0 then
    if coalesce(u.streak_count,0) <> 0 then
      update public.users set streak_count = 0 where telegram_id = p_user_id;
    end if;
    return jsonb_build_object('awarded', false, 'reason', 'missed_window', 'streak', 0);
  end if;

  -- One claim per UTC day
  perform 1 from public.daily_claims where user_id = p_user_id and claim_date = today_date;
  if found then
    return jsonb_build_object('awarded', false, 'reason', 'already_claimed_today', 'streak', u.streak_count);
  end if;

  day_in_cycle := (coalesce(u.streak_count,0) % 7) + 1;

  if day_in_cycle = 3 then
    reward_amount := 20; reward_type := 'streak20';
  elsif day_in_cycle = 7 then
    reward_amount := 50; reward_type := 'streak50';
  else
    reward_amount := 10; reward_type := 'daily10';
  end if;

  begin
    insert into public.daily_claims (user_id, claim_date, amount, reward_type, created_at)
    values (p_user_id, today_date, reward_amount, reward_type, now_utc);
    inserted := true;
  exception when unique_violation then
    inserted := false;
  end;

  if not inserted then
    return jsonb_build_object('awarded', false, 'reason', 'already_claimed_today', 'streak', u.streak_count);
  end if;

  if day_in_cycle = 7 then
    new_streak := 0;  -- wrap after 7th day
  else
    new_streak := coalesce(u.streak_count,0) + 1;
  end if;

  update public.users
  set gems = coalesce(gems,0) + reward_amount,
      last_daily_claim_at = now_utc,
      streak_count = new_streak
  where telegram_id = p_user_id;

  return jsonb_build_object('awarded', true, 'amount', reward_amount, 'reward_type', reward_type,
                            'streak', new_streak, 'day_in_cycle', day_in_cycle);
end;
$function$;

-- Fix get_total_earnings function
CREATE OR REPLACE FUNCTION public.get_total_earnings()
 RETURNS TABLE(total_stars bigint, total_transactions bigint, total_customers bigint, gems_revenue bigint, subscription_revenue bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(stars_amount), 0)::BIGINT as total_stars,
        COUNT(*)::BIGINT as total_transactions,
        COUNT(DISTINCT user_id)::BIGINT as total_customers,
        COALESCE(SUM(CASE WHEN payment_type = 'gems' THEN stars_amount ELSE 0 END), 0)::BIGINT as gems_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'subscription' THEN stars_amount ELSE 0 END), 0)::BIGINT as subscription_revenue
    FROM public.star_earnings;
END;
$function$;

-- Fix get_earnings_period function
CREATE OR REPLACE FUNCTION public.get_earnings_period(period_days integer)
 RETURNS TABLE(total_stars bigint, total_transactions bigint, unique_customers bigint, avg_transaction_value numeric)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  with period as (
    select * from public.star_earnings
    where created_at >= (now() at time zone 'utc') - make_interval(days => period_days)
  )
  select
    coalesce(sum(stars_amount),0)::bigint,
    count(*)::bigint,
    count(distinct user_id)::bigint,
    coalesce(avg(stars_amount)::numeric,0)
  from period;
$function$;

-- Fix increment_user_messages function
CREATE OR REPLACE FUNCTION public.increment_user_messages(p_user_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare
  today date := (now() at time zone 'utc')::date;
  last_date date;
begin
  select (last_message_date at time zone 'utc')::date
    into last_date
  from public.users
  where telegram_id = p_user_id;

  if last_date is null or last_date < today then
    update public.users
      set messages_today   = 1,
          total_messages   = coalesce(total_messages,0) + 1,
          last_message_date = now() at time zone 'utc'
    where telegram_id = p_user_id;
  else
    update public.users
      set messages_today   = messages_today + 1,
          total_messages   = coalesce(total_messages,0) + 1,
          last_message_date = now() at time zone 'utc'
    where telegram_id = p_user_id;
  end if;
end
$function$;

-- Fix activate_subscription function
CREATE OR REPLACE FUNCTION public.activate_subscription(p_user_id bigint, p_tier text, p_duration_days integer, p_provider_charge_id text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_tier_id text := lower(p_tier);
  v_start   timestamptz := now();
  v_end     timestamptz := now() + make_interval(days => p_duration_days);
BEGIN
  -- Ensure tier exists (idempotent)
  INSERT INTO public.subscription_tiers (id, display_name, days, active)
  VALUES (v_tier_id, initcap(v_tier_id), p_duration_days, TRUE)
  ON CONFLICT (id) DO NOTHING;

  IF p_provider_charge_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (user_id, tier_id, starts_at, expires_at, status, provider_charge_id)
    VALUES (p_user_id, v_tier_id, v_start, v_end, 'active', p_provider_charge_id)
    ON CONFLICT (provider_charge_id) DO UPDATE
      SET tier_id   = EXCLUDED.tier_id,
          starts_at = EXCLUDED.starts_at,
          expires_at= EXCLUDED.expires_at,
          status    = 'active';
  ELSE
    INSERT INTO public.subscriptions (user_id, tier_id, starts_at, expires_at, status)
    VALUES (p_user_id, v_tier_id, v_start, v_end, 'active');
  END IF;

  UPDATE public.users
     SET subscription_type = v_tier_id,
         subscription_end  = v_end,
         tier              = v_tier_id
   WHERE telegram_id = p_user_id;
END;
$function$;

-- Fix penis_ratings_denorm function
CREATE OR REPLACE FUNCTION public.penis_ratings_denorm()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.rating_title := COALESCE(
    NEW.provider_json->'rating'->>'title',
    NEW.provider_json->'rating'->>'creativeName',
    NEW.provider_json->>'creativeName',
    NEW.rating_title
  );
  NEW.rating_score := COALESCE(
    NULLIF(COALESCE(NEW.provider_json->'rating'->>'numericalRating',
                    NEW.provider_json->>'numericalRating'), '')::numeric,
    NEW.rating_score
  );
  NEW.rating_straight := COALESCE(
    NEW.provider_json->'rating'->>'physicalDescription',
    NEW.provider_json->>'physicalDescription',
    NEW.rating_straight
  );
  NEW.rating_steamy := COALESCE(
    NEW.provider_json->'rating'->>'eroticDescription',
    NEW.provider_json->>'eroticDescription',
    NEW.rating_steamy
  );
  IF NEW.penis_size IS NOT NULL AND (NEW.penis_size = '' OR upper(NEW.penis_size) = 'EMPTY') THEN
    NEW.penis_size := NULL;
  END IF;
  IF NEW.instructions IS NOT NULL AND (NEW.instructions = '' OR upper(NEW.instructions) = 'EMPTY') THEN
    NEW.instructions := NULL;
  END IF;
  RETURN NEW;
END
$function$;

-- Fix set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin 
  new.updated_at = now(); 
  return new; 
end 
$function$;