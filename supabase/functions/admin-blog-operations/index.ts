import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { validateTelegramWebAppData, extractTelegramUserId } from '../_shared/telegram-validation.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Telegram initData from header
    const telegramInitData = req.headers.get('X-Telegram-Init-Data');
    
    if (!telegramInitData) {
      console.log('❌ No Telegram authentication data provided');
      return new Response(
        JSON.stringify({ error: 'No Telegram authentication data' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Telegram data server-side
    const isValid = validateTelegramWebAppData(telegramInitData, botToken);
    
    if (!isValid) {
      console.log('❌ Invalid Telegram authentication signature');
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract Telegram ID from validated data
    const telegramId = extractTelegramUserId(telegramInitData);
    
    if (!telegramId) {
      console.log('❌ Could not extract Telegram user ID');
      return new Response(
        JSON.stringify({ error: 'Could not extract user ID' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role using security definer function
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { 
        _telegram_id: telegramId, 
        _role: 'admin' 
      });

    if (roleError) {
      console.error('❌ Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasAdminRole) {
      console.log(`❌ Admin check failed for telegram_id: ${telegramId}`);
      
      // Log failed authorization attempt
      await supabase.from('admin_audit_log').insert({
        telegram_id: telegramId,
        action: 'unauthorized_access_attempt',
        resource_type: 'blog_operations',
        success: false,
        error_message: 'User does not have admin role'
      });

      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Admin verified: telegram_id ${telegramId}`);

    // Proceed with admin operations
    const { operation, postId, postSlug, postData, status, published_at } = await req.json();

    let result;

    switch (operation) {
      case 'create':
        result = await supabase
          .from('blog_posts')
          .insert({ ...postData, author_telegram_id: telegramId })
          .select()
          .single();
        break;

      case 'update':
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId)
          .eq('author_telegram_id', telegramId)
          .select()
          .single();
        break;

      case 'delete':
        result = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId)
          .eq('author_telegram_id', telegramId);
        break;

      case 'fetch':
        result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', postSlug)
          .eq('author_telegram_id', telegramId)
          .maybeSingle();
        break;

      case 'fetchAll':
        result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('author_telegram_id', telegramId)
          .order('created_at', { ascending: false });
        break;

      case 'togglePublish':
        result = await supabase
          .from('blog_posts')
          .update({ status, published_at })
          .eq('id', postId)
          .eq('author_telegram_id', telegramId)
          .select()
          .single();
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Log the operation
    await supabase.from('admin_audit_log').insert({
      telegram_id: telegramId,
      action: operation,
      resource_type: 'blog_post',
      resource_id: postId || postSlug || (result.data as any)?.id || null,
      success: !result.error,
      error_message: result.error?.message || null
    });

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
