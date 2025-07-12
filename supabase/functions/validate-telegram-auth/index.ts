import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash, createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramInitData {
  [key: string]: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { initData } = await req.json()
    
    if (!initData) {
      return new Response(
        JSON.stringify({ error: 'Missing initData' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get bot token from environment
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: 'Bot token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the init data
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')

    // Sort parameters and create data check string
    const dataCheckArr: string[] = []
    for (const [key, value] of urlParams.entries()) {
      dataCheckArr.push(`${key}=${value}`)
    }
    dataCheckArr.sort()
    const dataCheckString = dataCheckArr.join('\n')

    // Create secret key
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

    // Create verification key
    const verificationKey = await crypto.subtle.importKey(
      'raw',
      tokenBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Calculate expected hash
    const expectedHashBuffer = await crypto.subtle.sign(
      'HMAC',
      verificationKey,
      new TextEncoder().encode(dataCheckString)
    )

    const expectedHash = Array.from(new Uint8Array(expectedHashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Verify hash
    if (hash !== expectedHash) {
      return new Response(
        JSON.stringify({ error: 'Invalid hash' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse user data
    const userParam = urlParams.get('user')
    if (!userParam) {
      return new Response(
        JSON.stringify({ error: 'No user data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userData = JSON.parse(userParam)

    return new Response(
      JSON.stringify({ 
        valid: true, 
        user: userData,
        authDate: urlParams.get('auth_date')
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Validation failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})