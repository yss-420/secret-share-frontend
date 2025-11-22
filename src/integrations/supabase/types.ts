export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_events: {
        Row: {
          ad_type: string | null
          created_at: string
          event_name: string
          id: number
          props: Json | null
          session_id: string | null
          user_id: number
        }
        Insert: {
          ad_type?: string | null
          created_at?: string
          event_name: string
          id?: number
          props?: Json | null
          session_id?: string | null
          user_id: number
        }
        Update: {
          ad_type?: string | null
          created_at?: string
          event_name?: string
          id?: number
          props?: Json | null
          session_id?: string | null
          user_id?: number
        }
        Relationships: []
      }
      ad_sessions: {
        Row: {
          ad_type: string
          created_at: string
          reason: string | null
          reward_gems: number
          session_id: string
          status: string
          updated_at: string
          user_id: number
        }
        Insert: {
          ad_type: string
          created_at?: string
          reason?: string | null
          reward_gems?: number
          session_id: string
          status?: string
          updated_at?: string
          user_id: number
        }
        Update: {
          ad_type?: string
          created_at?: string
          reason?: string | null
          reward_gems?: number
          session_id?: string
          status?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_telegram_id: number
          content: Json
          created_at: string | null
          featured_image_url: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_telegram_id: number
          content: Json
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_telegram_id?: number
          content?: Json
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          character_name: string
          created_at: string | null
          id: string
          message: string
          response: string
          telegram_id: number | null
          user_id: string | null
        }
        Insert: {
          character_name: string
          created_at?: string | null
          id?: string
          message: string
          response: string
          telegram_id?: number | null
          user_id?: string | null
        }
        Update: {
          character_name?: string
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          telegram_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          bot_response: string
          character: string
          created_at: string | null
          id: string
          user_id: number
          user_message: string
        }
        Insert: {
          bot_response: string
          character: string
          created_at?: string | null
          id?: string
          user_id: number
          user_message: string
        }
        Update: {
          bot_response?: string
          character?: string
          created_at?: string | null
          id?: string
          user_id?: number
          user_message?: string
        }
        Relationships: []
      }
      daily_claims: {
        Row: {
          amount: number
          claim_date: string
          created_at: string
          id: number
          reward_type: string
          user_id: number
        }
        Insert: {
          amount: number
          claim_date: string
          created_at?: string
          id?: number
          reward_type: string
          user_id: number
        }
        Update: {
          amount?: number
          claim_date?: string
          created_at?: string
          id?: number
          reward_type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_daily_claims_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_daily_claims_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_daily_claims_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_daily_claims_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      delivered_media: {
        Row: {
          media_type: string
          r2_key: string
          served_at: string
          user_id: number
        }
        Insert: {
          media_type: string
          r2_key: string
          served_at?: string
          user_id: number
        }
        Update: {
          media_type?: string
          r2_key?: string
          served_at?: string
          user_id?: number
        }
        Relationships: []
      }
      fight_history: {
        Row: {
          fight_timestamp: string
          id: string
          is_genesis_bot: boolean
          player1_champion_name: string
          player1_score: number
          player1_user_id: number
          player2_champion_name: string
          player2_score: number
          player2_user_id: number | null
          winner_user_id: number | null
        }
        Insert: {
          fight_timestamp?: string
          id?: string
          is_genesis_bot?: boolean
          player1_champion_name: string
          player1_score: number
          player1_user_id: number
          player2_champion_name: string
          player2_score: number
          player2_user_id?: number | null
          winner_user_id?: number | null
        }
        Update: {
          fight_timestamp?: string
          id?: string
          is_genesis_bot?: boolean
          player1_champion_name?: string
          player1_score?: number
          player1_user_id?: number
          player2_champion_name?: string
          player2_score?: number
          player2_user_id?: number | null
          winner_user_id?: number | null
        }
        Relationships: []
      }
      gem_packages: {
        Row: {
          description: string | null
          gems_amount: number | null
          id: number
          monthly_gems: number | null
          product_code: string
          stars_price: number
          tier: string | null
        }
        Insert: {
          description?: string | null
          gems_amount?: number | null
          id?: number
          monthly_gems?: number | null
          product_code: string
          stars_price: number
          tier?: string | null
        }
        Update: {
          description?: string | null
          gems_amount?: number | null
          id?: number
          monthly_gems?: number | null
          product_code?: string
          stars_price?: number
          tier?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          character_name: string
          created_at: string | null
          id: string
          image_url: string
          is_blurred: boolean | null
          prompt: string
          user_id: string | null
        }
        Insert: {
          character_name: string
          created_at?: string | null
          id?: string
          image_url: string
          is_blurred?: boolean | null
          prompt: string
          user_id?: string | null
        }
        Update: {
          character_name?: string
          created_at?: string | null
          id?: string
          image_url?: string
          is_blurred?: boolean | null
          prompt?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intro_cycles: {
        Row: {
          created_at: string
          end_at: string | null
          extend_from_end: boolean
          gems_credited: number
          id: string
          invoice_url: string | null
          payload: string | null
          payload_hash: string | null
          previous_cycle_id: string | null
          start_at: string | null
          status: string
          telegram_charge_id: string | null
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          end_at?: string | null
          extend_from_end?: boolean
          gems_credited?: number
          id?: string
          invoice_url?: string | null
          payload?: string | null
          payload_hash?: string | null
          previous_cycle_id?: string | null
          start_at?: string | null
          status: string
          telegram_charge_id?: string | null
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          end_at?: string | null
          extend_from_end?: boolean
          gems_credited?: number
          id?: string
          invoice_url?: string | null
          payload?: string | null
          payload_hash?: string | null
          previous_cycle_id?: string | null
          start_at?: string | null
          status?: string
          telegram_charge_id?: string | null
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "intro_cycles_previous_cycle_id_fkey"
            columns: ["previous_cycle_id"]
            isOneToOne: false
            referencedRelation: "intro_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      intro_reminder_jobs: {
        Row: {
          created_at: string
          cycle_id: string
          error: string | null
          id: string
          job_key: string
          kind: string
          run_at: string
          sent_at: string | null
          status: string
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          cycle_id: string
          error?: string | null
          id?: string
          job_key: string
          kind: string
          run_at: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          cycle_id?: string
          error?: string | null
          id?: string
          job_key?: string
          kind?: string
          run_at?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "intro_reminder_jobs_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "intro_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      penis_ratings: {
        Row: {
          character_slug: string
          created_at: string
          error_text: string | null
          gems_spent: number
          honesty: string
          id: string
          image_hash: string
          instructions: string | null
          penis_size: string | null
          provider_json: Json
          rating_score: number | null
          rating_steamy: string | null
          rating_straight: string | null
          rating_title: string | null
          reused_from_cache: boolean
          user_id: number
          voice_url: string | null
        }
        Insert: {
          character_slug: string
          created_at?: string
          error_text?: string | null
          gems_spent?: number
          honesty: string
          id?: string
          image_hash: string
          instructions?: string | null
          penis_size?: string | null
          provider_json: Json
          rating_score?: number | null
          rating_steamy?: string | null
          rating_straight?: string | null
          rating_title?: string | null
          reused_from_cache?: boolean
          user_id: number
          voice_url?: string | null
        }
        Update: {
          character_slug?: string
          created_at?: string
          error_text?: string | null
          gems_spent?: number
          honesty?: string
          id?: string
          image_hash?: string
          instructions?: string | null
          penis_size?: string | null
          provider_json?: Json
          rating_score?: number | null
          rating_steamy?: string | null
          rating_straight?: string | null
          rating_title?: string | null
          reused_from_cache?: boolean
          user_id?: number
          voice_url?: string | null
        }
        Relationships: []
      }
      processed_payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          error: string | null
          id: number
          invoice_payload: string | null
          payload: string
          processed_at: string
          provider_payment_charge_id: string | null
          refund_reason: string | null
          refunded: boolean | null
          refunded_at: string | null
          status: string
          telegram_charge_id: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          error?: string | null
          id?: number
          invoice_payload?: string | null
          payload: string
          processed_at: string
          provider_payment_charge_id?: string | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          status?: string
          telegram_charge_id: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          error?: string | null
          id?: number
          invoice_payload?: string | null
          payload?: string
          processed_at?: string
          provider_payment_charge_id?: string | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          status?: string
          telegram_charge_id?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "processed_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "processed_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "processed_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "processed_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      r2_assets: {
        Row: {
          character_slug: string
          created_at: string
          media_type: string
          r2_key: string
        }
        Insert: {
          character_slug: string
          created_at?: string
          media_type: string
          r2_key: string
        }
        Update: {
          character_slug?: string
          created_at?: string
          media_type?: string
          r2_key?: string
        }
        Relationships: []
      }
      rating_cache: {
        Row: {
          created_at: string
          honesty: string
          image_hash: string
          instructions: string
          penis_size: string
          provider_json: Json
        }
        Insert: {
          created_at?: string
          honesty: string
          image_hash: string
          instructions?: string
          penis_size?: string
          provider_json: Json
        }
        Update: {
          created_at?: string
          honesty?: string
          image_hash?: string
          instructions?: string
          penis_size?: string
          provider_json?: Json
        }
        Relationships: []
      }
      relationships: {
        Row: {
          character_name: string
          experience: number | null
          id: string
          images_unlocked: number | null
          last_interaction: string | null
          level: number | null
          messages_count: number | null
          user_id: string | null
          videos_unlocked: number | null
        }
        Insert: {
          character_name: string
          experience?: number | null
          id?: string
          images_unlocked?: number | null
          last_interaction?: string | null
          level?: number | null
          messages_count?: number | null
          user_id?: string | null
          videos_unlocked?: number | null
        }
        Update: {
          character_name?: string
          experience?: number | null
          id?: string
          images_unlocked?: number | null
          last_interaction?: string | null
          level?: number | null
          messages_count?: number | null
          user_id?: string | null
          videos_unlocked?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      star_earnings: {
        Row: {
          created_at: string | null
          gems_granted: number | null
          id: number
          payload: string
          payment_type: string
          processed_at: string | null
          stars_amount: number
          subscription_tier: string | null
          telegram_charge_id: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          gems_granted?: number | null
          id?: number
          payload: string
          payment_type: string
          processed_at?: string | null
          stars_amount: number
          subscription_tier?: string | null
          telegram_charge_id: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          gems_granted?: number | null
          id?: number
          payload?: string
          payment_type?: string
          processed_at?: string | null
          stars_amount?: number
          subscription_tier?: string | null
          telegram_charge_id?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "star_earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "star_earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "star_earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "star_earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          active: boolean
          days: number | null
          display_name: string
          id: string
          monthly_gems: number
          monthly_stars: number
          price_stars: number
          sort_order: number | null
        }
        Insert: {
          active?: boolean
          days?: number | null
          display_name: string
          id: string
          monthly_gems?: number
          monthly_stars?: number
          price_stars?: number
          sort_order?: number | null
        }
        Update: {
          active?: boolean
          days?: number | null
          display_name?: string
          id?: string
          monthly_gems?: number
          monthly_stars?: number
          price_stars?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string
          expires_at: string
          id: number
          is_recurring: boolean
          next_renewal_at: string | null
          provider_charge_id: string | null
          source: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier: string
          tier_id: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string
          expires_at: string
          id?: number
          is_recurring?: boolean
          next_renewal_at?: string | null
          provider_charge_id?: string | null
          source?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier: string
          tier_id?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string
          expires_at?: string
          id?: number
          is_recurring?: boolean
          next_renewal_at?: string | null
          provider_charge_id?: string | null
          source?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: string
          tier_id?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          props: Json | null
          user_id: number
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          props?: Json | null
          user_id: number
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          props?: Json | null
          user_id?: number
        }
        Relationships: []
      }
      user_pass_balances: {
        Row: {
          arena_passes: number
          created_at: string
          last_refreshed_at: string
          rating_passes: number
          updated_at: string
          user_id: number
        }
        Insert: {
          arena_passes?: number
          created_at?: string
          last_refreshed_at?: string
          rating_passes?: number
          updated_at?: string
          user_id: number
        }
        Update: {
          arena_passes?: number
          created_at?: string
          last_refreshed_at?: string
          rating_passes?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          ads_last_bonus_at: string | null
          ads_last_inapp_at: string | null
          ads_last_rewarded_at: string | null
          ads_rewarded_date: string | null
          ads_rewarded_today: number
          age_verified: boolean | null
          bemob_cid: string | null
          blocked: boolean | null
          blocked_at: string | null
          bonus_messages_in_window: number
          characters_tried: string[] | null
          created_at: string | null
          deactivated: boolean | null
          discovery_prompts_sent: number | null
          first_rating_used: boolean | null
          follow_up_count: number | null
          free_arena_battles_used: number | null
          gems: number | null
          has_completed_onboarding: boolean | null
          id: string
          last_active: string | null
          last_bonus_reminder_at: string | null
          last_conversation_topic: string | null
          last_daily_claim_at: string | null
          last_discovery_prompt_at: string | null
          last_follow_up_sent: string | null
          last_login_date: string | null
          last_message_date: string | null
          last_reward_claimed_at: string | null
          last_seen: string | null
          launch_promo_seen_at: string | null
          login_streak: number | null
          message_window_index: number
          message_window_started_at: string | null
          messages_today: number | null
          nickname: string | null
          onboarding_quiz_answers: Json | null
          pending_gem_refund: number | null
          recommended_character: string | null
          session_data: Json | null
          streak_broken_at: string | null
          streak_count: number
          subscription_end: string | null
          subscription_type: string | null
          telegram_id: number
          tier: string | null
          total_gems_spent: number | null
          total_logins: number | null
          total_messages: number | null
          total_spent: number | null
          updated_at: string | null
          user_name: string | null
          username: string | null
          videos_generated: number | null
        }
        Insert: {
          ads_last_bonus_at?: string | null
          ads_last_inapp_at?: string | null
          ads_last_rewarded_at?: string | null
          ads_rewarded_date?: string | null
          ads_rewarded_today?: number
          age_verified?: boolean | null
          bemob_cid?: string | null
          blocked?: boolean | null
          blocked_at?: string | null
          bonus_messages_in_window?: number
          characters_tried?: string[] | null
          created_at?: string | null
          deactivated?: boolean | null
          discovery_prompts_sent?: number | null
          first_rating_used?: boolean | null
          follow_up_count?: number | null
          free_arena_battles_used?: number | null
          gems?: number | null
          has_completed_onboarding?: boolean | null
          id?: string
          last_active?: string | null
          last_bonus_reminder_at?: string | null
          last_conversation_topic?: string | null
          last_daily_claim_at?: string | null
          last_discovery_prompt_at?: string | null
          last_follow_up_sent?: string | null
          last_login_date?: string | null
          last_message_date?: string | null
          last_reward_claimed_at?: string | null
          last_seen?: string | null
          launch_promo_seen_at?: string | null
          login_streak?: number | null
          message_window_index?: number
          message_window_started_at?: string | null
          messages_today?: number | null
          nickname?: string | null
          onboarding_quiz_answers?: Json | null
          pending_gem_refund?: number | null
          recommended_character?: string | null
          session_data?: Json | null
          streak_broken_at?: string | null
          streak_count?: number
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id: number
          tier?: string | null
          total_gems_spent?: number | null
          total_logins?: number | null
          total_messages?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_name?: string | null
          username?: string | null
          videos_generated?: number | null
        }
        Update: {
          ads_last_bonus_at?: string | null
          ads_last_inapp_at?: string | null
          ads_last_rewarded_at?: string | null
          ads_rewarded_date?: string | null
          ads_rewarded_today?: number
          age_verified?: boolean | null
          bemob_cid?: string | null
          blocked?: boolean | null
          blocked_at?: string | null
          bonus_messages_in_window?: number
          characters_tried?: string[] | null
          created_at?: string | null
          deactivated?: boolean | null
          discovery_prompts_sent?: number | null
          first_rating_used?: boolean | null
          follow_up_count?: number | null
          free_arena_battles_used?: number | null
          gems?: number | null
          has_completed_onboarding?: boolean | null
          id?: string
          last_active?: string | null
          last_bonus_reminder_at?: string | null
          last_conversation_topic?: string | null
          last_daily_claim_at?: string | null
          last_discovery_prompt_at?: string | null
          last_follow_up_sent?: string | null
          last_login_date?: string | null
          last_message_date?: string | null
          last_reward_claimed_at?: string | null
          last_seen?: string | null
          launch_promo_seen_at?: string | null
          login_streak?: number | null
          message_window_index?: number
          message_window_started_at?: string | null
          messages_today?: number | null
          nickname?: string | null
          onboarding_quiz_answers?: Json | null
          pending_gem_refund?: number | null
          recommended_character?: string | null
          session_data?: Json | null
          streak_broken_at?: string | null
          streak_count?: number
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id?: number
          tier?: string | null
          total_gems_spent?: number | null
          total_logins?: number | null
          total_messages?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_name?: string | null
          username?: string | null
          videos_generated?: number | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          character_name: string
          created_at: string | null
          duration: number | null
          gems_cost: number | null
          id: string
          prompt: string
          request_id: string | null
          status: string | null
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          character_name: string
          created_at?: string | null
          duration?: number | null
          gems_cost?: number | null
          id?: string
          prompt: string
          request_id?: string | null
          status?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          character_name?: string
          created_at?: string | null
          duration?: number | null
          gems_cost?: number | null
          id?: string
          prompt?: string
          request_id?: string | null
          status?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_calls: {
        Row: {
          agent_id: string
          call_id: string
          created_at: string | null
          duration_minutes: number
          gem_cost: number
          id: number
          phone_number: string
          status: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          agent_id: string
          call_id: string
          created_at?: string | null
          duration_minutes?: number
          gem_cost?: number
          id?: number
          phone_number: string
          status?: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          agent_id?: string
          call_id?: string
          created_at?: string | null
          duration_minutes?: number
          gem_cost?: number
          id?: number
          phone_number?: string
          status?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_voice_calls_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_voice_calls_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_voice_calls_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "fk_voice_calls_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      willy_arena_submissions: {
        Row: {
          champion_name: string
          id: string
          rating_score: number
          submitted_at: string
          telegram_file_id: string
          user_id: number
        }
        Insert: {
          champion_name: string
          id?: string
          rating_score: number
          submitted_at?: string
          telegram_file_id: string
          user_id: number
        }
        Update: {
          champion_name?: string
          id?: string
          rating_score?: number
          submitted_at?: string
          telegram_file_id?: string
          user_id?: number
        }
        Relationships: []
      }
      willy_leaderboard: {
        Row: {
          alltime_score: number | null
          best_streak: number
          champion_name: string
          created_at: string
          last_duel_at: string | null
          last_monthly_reset: string | null
          losses: number
          monthly_best_streak: number | null
          monthly_current_streak: number | null
          monthly_losses: number | null
          monthly_score: number | null
          monthly_wins: number | null
          total_duels: number | null
          updated_at: string
          user_id: number
          win_rate: number | null
          win_streak: number
          wins: number
        }
        Insert: {
          alltime_score?: number | null
          best_streak?: number
          champion_name: string
          created_at?: string
          last_duel_at?: string | null
          last_monthly_reset?: string | null
          losses?: number
          monthly_best_streak?: number | null
          monthly_current_streak?: number | null
          monthly_losses?: number | null
          monthly_score?: number | null
          monthly_wins?: number | null
          total_duels?: number | null
          updated_at?: string
          user_id: number
          win_rate?: number | null
          win_streak?: number
          wins?: number
        }
        Update: {
          alltime_score?: number | null
          best_streak?: number
          champion_name?: string
          created_at?: string
          last_duel_at?: string | null
          last_monthly_reset?: string | null
          losses?: number
          monthly_best_streak?: number | null
          monthly_current_streak?: number | null
          monthly_losses?: number | null
          monthly_score?: number | null
          monthly_wins?: number | null
          total_duels?: number | null
          updated_at?: string
          user_id?: number
          win_rate?: number | null
          win_streak?: number
          wins?: number
        }
        Relationships: []
      }
    }
    Views: {
      arena_leaderboard_public: {
        Row: {
          alltime_score: number | null
          best_streak: number | null
          champion_name: string | null
          last_duel_at: string | null
          losses: number | null
          monthly_best_streak: number | null
          monthly_current_streak: number | null
          monthly_losses: number | null
          monthly_score: number | null
          monthly_wins: number | null
          win_streak: number | null
          wins: number | null
        }
        Insert: {
          alltime_score?: number | null
          best_streak?: number | null
          champion_name?: string | null
          last_duel_at?: string | null
          losses?: number | null
          monthly_best_streak?: number | null
          monthly_current_streak?: number | null
          monthly_losses?: number | null
          monthly_score?: number | null
          monthly_wins?: number | null
          win_streak?: number | null
          wins?: number | null
        }
        Update: {
          alltime_score?: number | null
          best_streak?: number | null
          champion_name?: string | null
          last_duel_at?: string | null
          losses?: number | null
          monthly_best_streak?: number | null
          monthly_current_streak?: number | null
          monthly_losses?: number | null
          monthly_score?: number | null
          monthly_wins?: number | null
          win_streak?: number | null
          wins?: number | null
        }
        Relationships: []
      }
      user_counters_mv: {
        Row: {
          images_generated: number | null
          telegram_id: number | null
          total_stars_spent: number | null
          user_uuid: string | null
          videos_generated: number | null
        }
        Relationships: []
      }
      user_status_public: {
        Row: {
          gems: number | null
          last_message_date: string | null
          messages_today: number | null
          subscription_end: string | null
          subscription_type: string | null
          telegram_id: number | null
          tier: string | null
          username: string | null
        }
        Insert: {
          gems?: number | null
          last_message_date?: string | null
          messages_today?: number | null
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id?: number | null
          tier?: string | null
          username?: string | null
        }
        Update: {
          gems?: number | null
          last_message_date?: string | null
          messages_today?: number | null
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id?: number | null
          tier?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_window_caps: {
        Row: {
          bonus_messages_in_window: number | null
          effective_cap: number | null
          hit_cap: boolean | null
          last_seen: string | null
          message_window_index: number | null
          message_window_started_at: string | null
          messages_today: number | null
          telegram_id: number | null
        }
        Insert: {
          bonus_messages_in_window?: number | null
          effective_cap?: never
          hit_cap?: never
          last_seen?: string | null
          message_window_index?: number | null
          message_window_started_at?: string | null
          messages_today?: number | null
          telegram_id?: number | null
        }
        Update: {
          bonus_messages_in_window?: number | null
          effective_cap?: never
          hit_cap?: never
          last_seen?: string | null
          message_window_index?: number | null
          message_window_started_at?: string | null
          messages_today?: number | null
          telegram_id?: number | null
        }
        Relationships: []
      }
      v_user_active_subscription: {
        Row: {
          created_at: string | null
          expires_at: string | null
          tier: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          tier?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          tier?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_counters_mv"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_status_public"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_window_caps"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
    }
    Functions: {
      activate_subscription: {
        Args: {
          p_duration_days: number
          p_provider_charge_id?: string
          p_tier: string
          p_user_id: number
        }
        Returns: undefined
      }
      apply_successful_payment: {
        Args: { p_invoice_id: string; p_provider_payment_id: string }
        Returns: boolean
      }
      cleanup_old_sessions: { Args: never; Returns: undefined }
      create_renewal_invoice: {
        Args: { p_amount_stars?: number; p_subscription_id: string }
        Returns: string
      }
      get_active_subscription_secure: {
        Args: { p_user_id?: number }
        Returns: {
          current_period_end: string
          is_recurring: boolean
          next_renewal_at: string
          status: string
          subscription_id: number
          tier_id: string
          tier_name: string
          user_id: number
        }[]
      }
      get_earnings_analytics: {
        Args: never
        Returns: {
          date: string
          stars_earned: number
          total_transactions: number
          unique_customers: number
        }[]
      }
      get_earnings_period: {
        Args: { period_days: number }
        Returns: {
          avg_transaction_value: number
          total_stars: number
          total_transactions: number
          unique_customers: number
        }[]
      }
      get_monthly_earnings: {
        Args: never
        Returns: {
          avg_transaction_value: number
          month: string
          total_stars: number
          total_transactions: number
          unique_customers: number
        }[]
      }
      get_my_stats: {
        Args: never
        Returns: {
          gems: number
          messages_today: number
          subscription_type: string
          telegram_id: number
        }[]
      }
      get_payment_analytics_secure: {
        Args: { p_days?: number }
        Returns: {
          avg_payment_amount: number
          failed_payments: number
          payment_date: string
          revenue_stars: number
          successful_payments: number
          total_payments: number
          unique_paying_users: number
        }[]
      }
      get_published_blog_posts: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          featured_image_url: string
          id: string
          meta_description: string
          published_at: string
          reading_time_minutes: number
          slug: string
          title: string
          view_count: number
        }[]
      }
      get_recent_opponents: {
        Args: { days_back?: number; p_user_id: number }
        Returns: {
          opponent_user_id: number
        }[]
      }
      get_session_analytics: {
        Args: never
        Returns: {
          avg_hours_since_last_seen: number
          total_users: number
          users_with_sessions: number
        }[]
      }
      get_top_customers_secure: {
        Args: { p_limit?: number }
        Returns: {
          telegram_id: number
          total_purchases: number
          total_stars_spent: number
          username: string
        }[]
      }
      get_total_earnings: {
        Args: never
        Returns: {
          gems_revenue: number
          subscription_revenue: number
          total_customers: number
          total_stars: number
          total_transactions: number
        }[]
      }
      get_user_conversations: {
        Args: { p_user_id?: number }
        Returns: {
          bot_response: string
          character: string
          created_at: string
          id: string
          user_id: number
          user_message: string
        }[]
      }
      get_user_stats_safe: {
        Args: { p_telegram_id: number }
        Returns: {
          gems: number
          messages_today: number
          subscription_type: string
          telegram_id: number
        }[]
      }
      get_user_status: {
        Args: never
        Returns: {
          gems: number
          messages_today: number
          subscription_type: string
          telegram_id: number
        }[]
      }
      get_user_status_secure: {
        Args: { p_telegram_id?: number }
        Returns: {
          gems: number
          messages_today: number
          subscription_type: string
          telegram_id: number
        }[]
      }
      get_user_window_caps_secure: {
        Args: { p_user_id?: string }
        Returns: {
          base_cap: number
          bonus_messages_in_window: number
          effective_cap: number
          hit_cap: boolean
          last_seen: string
          message_window_index: number
          message_window_started_at: string
          messages_today: number
          user_id: string
          username: string
        }[]
      }
      get_voice_call_analytics: {
        Args: never
        Returns: {
          avg_call_duration: number
          last_call_date: string
          telegram_id: number
          total_calls: number
          total_duration_minutes: number
          total_gems_spent: number
          user_name: string
          username: string
        }[]
      }
      increment_user_messages: {
        Args: { p_user_id: number }
        Returns: undefined
      }
      log_voice_call: {
        Args: {
          p_agent_id: string
          p_call_id: string
          p_gem_cost?: number
          p_phone_number: string
          p_user_id: number
        }
        Returns: undefined
      }
      process_daily_return_bonus: { Args: { p_user_id: number }; Returns: Json }
      process_payment_safely: {
        Args: {
          p_amount: number
          p_gems_to_add?: number
          p_payload: string
          p_subscription_days?: number
          p_subscription_tier?: string
          p_telegram_charge_id: string
          p_user_id: number
        }
        Returns: Json
      }
      update_call_duration: {
        Args: { p_call_id: string; p_duration_minutes: number }
        Returns: undefined
      }
    }
    Enums: {
      subscription_status:
        | "active"
        | "in_grace"
        | "past_due"
        | "canceled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: [
        "active",
        "in_grace",
        "past_due",
        "canceled",
        "expired",
      ],
    },
  },
} as const
