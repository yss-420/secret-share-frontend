import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyTelegramInitData, corsHeadersFor } from '../_shared/telegram-auth.ts'

serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get('Origin'))
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    // Authenticate via signed Telegram initData; derive the user id (never trust a client id).
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''
    const telegram_id = await verifyTelegramInitData(body?.initData ?? '', botToken)
    if (!telegram_id) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: user, error } = await supabase
      .from('users')
      .select('first_rating_used, free_arena_battles_used, gems, subscription_type')
      .eq('telegram_id', telegram_id)
      .single()

    if (error || !user) {
      console.error('Error fetching user:', error)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const RATING_GEM_COST = 150
    const ARENA_GEM_COST = 200

    const ratingStatus = {
      cost: RATING_GEM_COST,
      free: !user.first_rating_used,
      canAfford: user.gems >= RATING_GEM_COST,
      gems: user.gems,
      message: !user.first_rating_used
        ? '🎁 First rating FREE!'
        : user.gems >= RATING_GEM_COST
        ? `${RATING_GEM_COST} gems`
        : `Need ${RATING_GEM_COST} gems (you have ${user.gems})`
    }

    const freeBattlesRemaining = Math.max(0, 3 - (user.free_arena_battles_used || 0))
    const arenaStatus = {
      cost: ARENA_GEM_COST,
      free: freeBattlesRemaining > 0,
      remaining: freeBattlesRemaining,
      canAfford: user.gems >= ARENA_GEM_COST,
      gems: user.gems,
      message: freeBattlesRemaining > 0
        ? `🎁 ${freeBattlesRemaining} free battle${freeBattlesRemaining > 1 ? 's' : ''} left!`
        : user.gems >= ARENA_GEM_COST
        ? `${ARENA_GEM_COST} gems per battle`
        : `Need ${ARENA_GEM_COST} gems (you have ${user.gems})`
    }

    return new Response(
      JSON.stringify({
        rating: ratingStatus,
        arena: arenaStatus,
        gems: user.gems,
        subscription: user.subscription_type || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
