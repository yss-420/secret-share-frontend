import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const ADMIN_TELEGRAM_ID = 1226785406;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { operation, data, postId, postSlug } = await req.json();

    // Verify admin (in production, validate Telegram auth properly)
    if (data?.telegramId && data.telegramId !== ADMIN_TELEGRAM_ID) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;

    switch (operation) {
      case 'create':
        result = await supabase
          .from('blog_posts')
          .insert({ ...data.postData, author_telegram_id: ADMIN_TELEGRAM_ID })
          .select()
          .single();
        break;

      case 'update':
        result = await supabase
          .from('blog_posts')
          .update(data.postData)
          .eq('id', postId)
          .eq('author_telegram_id', ADMIN_TELEGRAM_ID)
          .select()
          .single();
        break;

      case 'delete':
        result = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId)
          .eq('author_telegram_id', ADMIN_TELEGRAM_ID);
        break;

      case 'fetch':
        result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', postSlug)
          .eq('author_telegram_id', ADMIN_TELEGRAM_ID)
          .maybeSingle();
        break;

      case 'fetchAll':
        result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('author_telegram_id', ADMIN_TELEGRAM_ID)
          .order('created_at', { ascending: false });
        break;

      case 'togglePublish':
        result = await supabase
          .from('blog_posts')
          .update({ 
            status: data.status, 
            published_at: data.published_at 
          })
          .eq('id', postId)
          .eq('author_telegram_id', ADMIN_TELEGRAM_ID)
          .select()
          .single();
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(result.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
