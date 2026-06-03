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
    // Authenticate via signed Telegram initData; derive the user id from it. This MUTATES (grants
    // daily gems) — previously callable for ANY telegram_id with no auth.
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

    const { data, error } = await supabaseClient.rpc('process_daily_return_bonus', {
      p_user_id: telegram_id
    })

    if (error) {
      console.error('Daily reward RPC error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process daily reward' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = Array.isArray(data) ? data[0] : data

    return new Response(
      JSON.stringify(result || { awarded: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Daily reward error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
