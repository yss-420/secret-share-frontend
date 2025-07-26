-- Enable RLS on missing tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chats table
CREATE POLICY "Users can view their own chats" 
ON public.chats 
FOR SELECT 
USING (telegram_id = (auth.uid())::bigint);

CREATE POLICY "Users can insert their own chats" 
ON public.chats 
FOR INSERT 
WITH CHECK (telegram_id = (auth.uid())::bigint);

CREATE POLICY "Service role can manage chats" 
ON public.chats 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create RLS policies for images table
CREATE POLICY "Users can view their own images" 
ON public.images 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own images" 
ON public.images 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage images" 
ON public.images 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create RLS policies for relationships table
CREATE POLICY "Users can view their own relationships" 
ON public.relationships 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own relationships" 
ON public.relationships 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own relationships" 
ON public.relationships 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Service role can manage relationships" 
ON public.relationships 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage transactions" 
ON public.transactions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create RLS policies for videos table
CREATE POLICY "Users can view their own videos" 
ON public.videos 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage videos" 
ON public.videos 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix database functions to use immutable search paths
CREATE OR REPLACE FUNCTION public.increment_user_messages(p_user_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  UPDATE public.users
  SET
    messages_today = messages_today + 1,
    total_messages = total_messages + 1,
    last_message_date = NOW(),
    last_seen = NOW()
  WHERE
    telegram_id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_voice_call(p_user_id bigint, p_call_id character varying, p_agent_id character varying, p_phone_number character varying, p_gem_cost integer DEFAULT 0)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  INSERT INTO public.voice_calls (
    user_id,
    call_id,
    agent_id,
    phone_number,
    gem_cost,
    status,
    created_at
  ) VALUES (
    p_user_id,
    p_call_id,
    p_agent_id,
    p_phone_number,
    p_gem_cost,
    'initiated',
    NOW()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_call_duration(p_call_id character varying, p_duration_minutes integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  UPDATE public.voice_calls
  SET
    duration_minutes = p_duration_minutes,
    status = 'completed',
    updated_at = NOW()
  WHERE
    call_id = p_call_id;
END;
$function$;