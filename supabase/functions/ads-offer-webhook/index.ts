import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Monetag postback webhook handler.
 *
 * Monetag sends postbacks with these macros (configured in their dashboard):
 *   session_id={ymid}&user_id={telegram_id}&reward={reward}&event_type={event_type}
 *   &zone_id={zone_id}&subzone_id={subzone_id}&price={estimated_price}
 *
 * Key mapping:
 *   - {ymid}           → session_id  (UUID we passed when showing the ad)
 *   - {telegram_id}    → user_id     (Telegram user ID)
 *   - {reward}         → "yes" or "no" (whether the event is paid/rewarded)
 *   - {event_type}     → "impression" or "click"
 *   - {estimated_price} → decimal price of the event
 *
 * Legacy mapping (also supported for backwards compat):
 *   - status=completed  → treated same as reward=yes
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // Extract parameters — support both new Monetag macros and legacy format
    const sessionId = url.searchParams.get('session_id') || url.searchParams.get('ymid');
    const userId = url.searchParams.get('user_id') || url.searchParams.get('telegram_id');
    const reward = url.searchParams.get('reward');           // "yes" or "no"
    const legacyStatus = url.searchParams.get('status');     // "completed" or "rejected" (legacy)
    const eventType = url.searchParams.get('event_type');    // "impression" or "click"
    const estimatedPrice = url.searchParams.get('price') || url.searchParams.get('estimated_price') || '0';
    const zoneId = url.searchParams.get('zone_id');
    const subzoneId = url.searchParams.get('subzone_id');

    // Determine if this is a paid/completed event
    const isCompleted = reward === 'yes' || legacyStatus === 'completed';

    console.log('[ADS WEBHOOK] Postback received:', {
      sessionId, userId, reward, legacyStatus, eventType,
      estimatedPrice, zoneId, subzoneId, isCompleted,
      fullUrl: req.url,
    });

    // Validate required parameters
    if (!sessionId || !userId) {
      console.error('[ADS WEBHOOK] Missing required params:', { sessionId, userId });
      // Always return 200 to prevent Monetag from retrying bad requests
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Collect postback metadata
    const postbackData: Record<string, string | null> = {
      reward, event_type: eventType, estimated_price: estimatedPrice,
      zone_id: zoneId, subzone_id: subzoneId, legacy_status: legacyStatus,
    };

    // Try to parse body for additional data (Monetag may send empty body)
    try {
      const body = await req.text();
      if (body) {
        const parsed = JSON.parse(body);
        Object.assign(postbackData, parsed);
      }
    } catch {
      // No valid JSON body — fine, URL params are sufficient
    }

    // Look up the session
    const { data: session, error: fetchError } = await supabase
      .from('ad_sessions')
      .select('session_id, user_id, ad_type, status, reward_gems')
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('[ADS WEBHOOK] Session not found:', { sessionId, fetchError });
      // Still return 200 to prevent retries
      return new Response(
        JSON.stringify({ error: 'Session not found', session_id: sessionId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user_id matches (prevent cross-user attacks)
    if (session.user_id !== parseInt(userId)) {
      console.error('[ADS WEBHOOK] User mismatch:', { sessionUser: session.user_id, postbackUser: userId });
      return new Response(
        JSON.stringify({ error: 'User mismatch' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Idempotency: skip if already completed
    if (session.status === 'completed') {
      console.log('[ADS WEBHOOK] Session already completed, skipping:', sessionId);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isCompleted) {
      // Determine gems based on ad_type (FIX: was session.type, now session.ad_type)
      let gemsToAward = 0;
      if (session.ad_type === 'quick') {
        gemsToAward = 10;
      } else if (session.ad_type === 'bonus') {
        gemsToAward = 50;
      }
      // interstitial = 0 gems (but still mark completed for tracking)

      // Update session to completed
      const { error: updateError } = await supabase
        .from('ad_sessions')
        .update({
          status: 'completed',
          reward_gems: gemsToAward,
          completed_at: new Date().toISOString(),
          postback_data: postbackData,
          estimated_price: parseFloat(estimatedPrice) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('[ADS WEBHOOK] Failed to update session:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update session' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Award gems if applicable
      if (gemsToAward > 0) {
        const { data: currentUser, error: fetchUserError } = await supabase
          .from('users')
          .select('gems')
          .eq('telegram_id', parseInt(userId))
          .single();

        if (fetchUserError) {
          console.error('[ADS WEBHOOK] Failed to fetch user:', fetchUserError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch user' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const newGems = (currentUser?.gems || 0) + gemsToAward;

        // Update gems and ad state in user record
        const userUpdates: Record<string, any> = {
          gems: newGems,
          updated_at: new Date().toISOString(),
        };

        // Set type-specific cooldown timestamps
        if (session.ad_type === 'bonus') {
          userUpdates.ads_last_bonus_at = new Date().toISOString();
        } else if (session.ad_type === 'quick') {
          userUpdates.ads_last_rewarded_at = new Date().toISOString();
        }

        const { error: gemsError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('telegram_id', parseInt(userId));

        if (gemsError) {
          console.error('[ADS WEBHOOK] Failed to award gems:', gemsError);
          return new Response(
            JSON.stringify({ error: 'Failed to award gems' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[ADS WEBHOOK] Awarded ${gemsToAward} gems to user ${userId} for ${session.ad_type} ad (session: ${sessionId})`);
      } else {
        // Interstitial: update last shown timestamp
        await supabase
          .from('users')
          .update({
            ads_last_inapp_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('telegram_id', parseInt(userId));

        console.log(`[ADS WEBHOOK] Marked interstitial completed for user ${userId} (session: ${sessionId})`);
      }

      // Log ad event for analytics
      await supabase.from('ad_events').insert({
        user_id: parseInt(userId),
        event_name: 'webhook_completed',
        ad_type: session.ad_type,
        session_id: sessionId,
        props: { gems_awarded: gemsToAward, ...postbackData },
        created_at: new Date().toISOString(),
      });

    } else {
      // Non-rewarded event (reward=no) — log for analytics but don't reject session
      // The ad may still be in progress; only mark rejected if explicitly told
      if (legacyStatus === 'rejected') {
        await supabase
          .from('ad_sessions')
          .update({
            status: 'rejected',
            reason: 'monetag_rejected',
            postback_data: postbackData,
            updated_at: new Date().toISOString(),
          })
          .eq('session_id', sessionId);
      }

      // Log non-rewarded event
      await supabase.from('ad_events').insert({
        user_id: parseInt(userId),
        event_name: reward === 'no' ? 'webhook_non_rewarded' : 'webhook_other',
        ad_type: session.ad_type,
        session_id: sessionId,
        props: postbackData,
        created_at: new Date().toISOString(),
      });

      console.log(`[ADS WEBHOOK] Non-rewarded event for session ${sessionId}: reward=${reward}, event_type=${eventType}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Postback processed',
        session_id: sessionId,
        completed: isCompleted,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[ADS WEBHOOK] Unhandled error:', error);
    // Always 200 to prevent Monetag retries
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
