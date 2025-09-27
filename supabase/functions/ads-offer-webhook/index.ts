import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const userId = url.searchParams.get('user_id');
    const status = url.searchParams.get('status');

    console.log('Monetag postback received:', { sessionId, userId, status, url: req.url });

    // Validate required parameters
    if (!sessionId || !userId || !status) {
      console.error('Missing required parameters:', { sessionId, userId, status });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the body for additional data
    let postbackData = {};
    try {
      const body = await req.text();
      if (body) {
        postbackData = JSON.parse(body);
      }
    } catch (e) {
      console.log('No valid JSON body, using URL params only');
    }

    console.log('Postback data:', postbackData);

    // Update the ad session in the database
    const { data: session, error: fetchError } = await supabase
      .from('ad_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', parseInt(userId))
      .single();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only process if status is completed
    if (status === 'completed') {
      const { error: updateError } = await supabase
        .from('ad_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          postback_data: postbackData,
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .eq('user_id', parseInt(userId));

      if (updateError) {
        console.error('Error updating session:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Award gems based on ad type
      let gemsToAward = 0;
      if (session.type === 'quick') {
        gemsToAward = 10;
      } else if (session.type === 'bonus') {
        gemsToAward = 50;
      }

      if (gemsToAward > 0) {
        // First fetch current gems to avoid SQL injection
        const { data: currentUser, error: fetchUserError } = await supabase
          .from('users')
          .select('gems')
          .eq('telegram_id', parseInt(userId))
          .single();

        if (fetchUserError) {
          console.error('Error fetching user for gems update:', fetchUserError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch user data' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Safely calculate new gems total
        const newGems = (currentUser?.gems || 0) + gemsToAward;

        // Update user gems with safe parameterized value
        const { error: gemsError } = await supabase
          .from('users')
          .update({
            gems: newGems,
            updated_at: new Date().toISOString()
          })
          .eq('telegram_id', parseInt(userId));

        if (gemsError) {
          console.error('Error updating user gems:', gemsError);
          return new Response(
            JSON.stringify({ error: 'Failed to award gems' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Awarded ${gemsToAward} gems to user ${userId} for ${session.type} ad completion`);
      }
    }

    console.log('Postback processed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Postback processed',
        session_id: sessionId,
        user_id: userId,
        status: status
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Postback webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});