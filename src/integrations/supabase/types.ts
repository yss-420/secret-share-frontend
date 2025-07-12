export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age_verified: boolean | null
          created_at: string | null
          gems: number | null
          id: string
          last_active: string | null
          last_message_date: string | null
          last_seen: string | null
          messages_today: number | null
          nickname: string | null
          subscription_end: string | null
          subscription_type: string | null
          telegram_id: number
          tier: string | null
          total_gems_spent: number | null
          total_messages: number | null
          total_spent: number | null
          user_name: string | null
          username: string | null
          videos_generated: number | null
        }
        Insert: {
          age_verified?: boolean | null
          created_at?: string | null
          gems?: number | null
          id?: string
          last_active?: string | null
          last_message_date?: string | null
          last_seen?: string | null
          messages_today?: number | null
          nickname?: string | null
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id: number
          tier?: string | null
          total_gems_spent?: number | null
          total_messages?: number | null
          total_spent?: number | null
          user_name?: string | null
          username?: string | null
          videos_generated?: number | null
        }
        Update: {
          age_verified?: boolean | null
          created_at?: string | null
          gems?: number | null
          id?: string
          last_active?: string | null
          last_message_date?: string | null
          last_seen?: string | null
          messages_today?: number | null
          nickname?: string | null
          subscription_end?: string | null
          subscription_type?: string | null
          telegram_id?: number
          tier?: string | null
          total_gems_spent?: number | null
          total_messages?: number | null
          total_spent?: number | null
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      conversations_view: {
        Row: {
          bot_response: string | null
          character: string | null
          created_at: string | null
          id: string | null
          user_id: number | null
          user_message: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_user_messages: {
        Args: { p_user_id: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
