import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { initData } = await req.json()

    if (!initData) {
      return new Response(
        JSON.stringify({ error: 'Missing initData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate Telegram initData
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: 'Bot token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')

    const dataCheckArr: string[] = []
    for (const [key, value] of urlParams.entries()) {
      dataCheckArr.push(`${key}=${value}`)
    }
    dataCheckArr.sort()
    const dataCheckString = dataCheckArr.join('\n')

    const secretKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const tokenBuffer = await crypto.subtle.sign(
      'HMAC',
      secretKey,
      new TextEncoder().encode(botToken)
    )

    const verificationKey = await crypto.subtle.importKey(
      'raw',
      tokenBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const expectedHashBuffer = await crypto.subtle.sign(
      'HMAC',
      verificationKey,
      new TextEncoder().encode(dataCheckString)
    )

    const expectedHash = Array.from(new Uint8Array(expectedHashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (hash !== expectedHash) {
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram auth' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Reject stale initData (older than 1 hour) to prevent replay attacks
    const authDate = urlParams.get('auth_date')
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10)
      const nowSeconds = Math.floor(Date.now() / 1000)
      if (nowSeconds - authTimestamp > 3600) {
        return new Response(
          JSON.stringify({ error: 'Expired initData' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Extract user data from validated initData
    const userParam = urlParams.get('user')
    if (!userParam) {
      return new Response(
        JSON.stringify({ error: 'No user data in initData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const telegramUser = JSON.parse(userParam)
    const telegramId = telegramUser.id

    // Use service_role to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Try to fetch existing user
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist — create
      const { data: newUser, error: insertError } = await supabaseClient
        .from('users')
        .insert({
          telegram_id: telegramId,
          username: telegramUser.username || null,
          user_name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
          nickname: telegramUser.first_name,
          gems: 100,
          tier: 'free'
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ user: newUser, created: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update last_seen
    await supabaseClient
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('telegram_id', telegramId)

    return new Response(
      JSON.stringify({ user: existingUser, created: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Upsert user error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
