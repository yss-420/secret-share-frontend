import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { verifyTelegramInitData, corsHeadersFor } from '../_shared/telegram-auth.ts'

serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get('Origin'))
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    // Authenticate via signed Telegram initData; derive the user id from it (never trust a
    // client-supplied telegram_id). This endpoint previously returned gems/tier/messages for ANY
    // telegram_id with no auth.
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''
    const telegram_id = await verifyTelegramInitData(body?.initData ?? '', botToken)
    if (!telegram_id) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseClient.rpc('get_user_stats_safe', {
      p_telegram_id: telegram_id
    })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ gems: 100, messages_today: 0, subscription_type: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userData = data[0]
    return new Response(
      JSON.stringify({
        gems: userData.gems || 0,
        messages_today: userData.messages_today || 0,
        subscription_type: userData.subscription_type
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
