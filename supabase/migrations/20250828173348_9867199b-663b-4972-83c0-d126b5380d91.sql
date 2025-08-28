-- Insert the dev user into user_header_stats for testing
INSERT INTO public.user_header_stats (telegram_id, gems, messages_today, subscription_type)
VALUES (123456789, 250, 5, 'free')
ON CONFLICT (telegram_id) DO UPDATE SET
  gems = EXCLUDED.gems,
  messages_today = EXCLUDED.messages_today,
  subscription_type = EXCLUDED.subscription_type,
  last_updated = now();