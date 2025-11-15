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
      builds: {
        Row: {
          author_id: string | null
          cover_url: string | null
          created_at: string
          id: string
          published_at: string | null
          shop_id: string | null
          specs: Json | null
          status: string | null
          title: string
          vehicle_trim_id: string | null
        }
        Insert: {
          author_id?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          shop_id?: string | null
          specs?: Json | null
          status?: string | null
          title: string
          vehicle_trim_id?: string | null
        }
        Update: {
          author_id?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          shop_id?: string | null
          specs?: Json | null
          status?: string | null
          title?: string
          vehicle_trim_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "builds_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "builds_vehicle_trim_id_fkey"
            columns: ["vehicle_trim_id"]
            isOneToOne: false
            referencedRelation: "vehicle_trims"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          body: string
          build_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          build_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          build_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      build_updates: {
        Row: {
          author_id: string
          body: string | null
          build_id: string
          created_at: string
          id: string
          media_asset_id: string | null
          progress_percent: number | null
          title: string | null
        }
        Insert: {
          author_id: string
          body?: string | null
          build_id: string
          created_at?: string
          id?: string
          media_asset_id?: string | null
          progress_percent?: number | null
          title?: string | null
        }
        Update: {
          author_id?: string
          body?: string | null
          build_id?: string
          created_at?: string
          id?: string
          media_asset_id?: string | null
          progress_percent?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_updates_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_updates_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      build_vehicle_specs: {
        Row: {
          acquisition_source: string | null
          asking_price: number | null
          build_id: string
          condition_notes: string | null
          exterior_color: string | null
          interior_color: string | null
          mileage: number | null
          vin: string | null
        }
        Insert: {
          acquisition_source?: string | null
          asking_price?: number | null
          build_id: string
          condition_notes?: string | null
          exterior_color?: string | null
          interior_color?: string | null
          mileage?: number | null
          vin?: string | null
        }
        Update: {
          acquisition_source?: string | null
          asking_price?: number | null
          build_id?: string
          condition_notes?: string | null
          exterior_color?: string | null
          interior_color?: string | null
          mileage?: number | null
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_vehicle_specs_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: true
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      mod_lists: {
        Row: {
          build_id: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          build_id: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          build_id?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mod_lists_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      mod_list_items: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string
          id: string
          list_id: string
          manufacturer: string | null
          part_name: string
          part_number: string | null
          status: string | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string
          id?: string
          list_id: string
          manufacturer?: string | null
          part_name: string
          part_number?: string | null
          status?: string | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string
          id?: string
          list_id?: string
          manufacturer?: string | null
          part_name?: string
          part_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mod_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "mod_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_makes: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_models: {
        Row: {
          id: string
          make_id: string
          name: string
        }
        Insert: {
          id?: string
          make_id: string
          name: string
        }
        Update: {
          id?: string
          make_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_trims: {
        Row: {
          base_msrp: number | null
          drivetrain: string | null
          engine: string | null
          id: string
          model_id: string
          transmission: string | null
          trim_name: string | null
          year: number | null
        }
        Insert: {
          base_msrp?: number | null
          drivetrain?: string | null
          engine?: string | null
          id?: string
          model_id: string
          transmission?: string | null
          trim_name?: string | null
          year?: number | null
        }
        Update: {
          base_msrp?: number | null
          drivetrain?: string | null
          engine?: string | null
          id?: string
          model_id?: string
          transmission?: string | null
          trim_name?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_trims_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          metadata: Json | null
          owner_id: string | null
          owner_type: Database["public"]["Enums"]["media_owner_type"]
          path: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          owner_type: Database["public"]["Enums"]["media_owner_type"]
          path: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          owner_type?: Database["public"]["Enums"]["media_owner_type"]
          path?: string
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          build_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          last_message_at: string | null
          shop_id: string | null
        }
        Insert: {
          build_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          shop_id?: string | null
        }
        Update: {
          build_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          shop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          joined_at: string
          role: Database["public"]["Enums"]["message_participant_role"]
          thread_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          role?: Database["public"]["Enums"]["message_participant_role"]
          thread_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: Database["public"]["Enums"]["message_participant_role"]
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          id: string
          media_asset_id: string | null
          read_at: string | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          media_asset_id?: string | null
          read_at?: string | null
          sender_id: string
          thread_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          media_asset_id?: string | null
          read_at?: string | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          build_id: string | null
          created_at: string
          id: string
          message_id: string | null
          payload: Json | null
          quote_id: string | null
          read_at: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          build_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          payload?: Json | null
          quote_id?: string | null
          read_at?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          actor_id?: string | null
          build_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          payload?: Json | null
          quote_id?: string | null
          read_at?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_verification_requests: {
        Row: {
          id: string
          notes: string | null
          reviewer_id: string | null
          shop_id: string
          status: string
          submitted_at: string
          submitted_by: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          shop_id: string
          status?: string
          submitted_at?: string
          submitted_by: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          shop_id?: string
          status?: string
          submitted_at?: string
          submitted_by?: string
          reviewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_verification_requests_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_verification_requests_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_verification_requests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_accounts: {
        Row: {
          account_id: string
          created_at: string
          id: string
          onboarding_complete: boolean
          shop_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          shop_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_accounts_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_prices: {
        Row: {
          build_id: string | null
          created_at: string
          currency: string
          id: string
          price_id: string
          unit_amount: number
        }
        Insert: {
          build_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          price_id: string
          unit_amount: number
        }
        Update: {
          build_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          price_id?: string
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "stripe_prices_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payer_id: string | null
          quote_id: string | null
          status: string
          stripe_payment_intent: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payer_id?: string | null
          quote_id?: string | null
          status: string
          stripe_payment_intent?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payer_id?: string | null
          quote_id?: string | null
          status?: string
          stripe_payment_intent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          created_at: string
          event_id: string
          id: string
          payload: Json
          processed_at: string | null
          type: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          payload: Json
          processed_at?: string | null
          type: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          type?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          id: string
          location: string | null
          starts_at: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          starts_at?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          starts_at?: string | null
          title?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          build_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          build_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          build_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          build_id: string
          created_at: string
          details: string | null
          id: string
          estimated_total: number | null
          expires_at: string | null
          requester_id: string
          shop_id: string | null
          status: Database["public"]["Enums"]["quote_status"]
          thread_id: string | null
        }
        Insert: {
          build_id: string
          created_at?: string
          details?: string | null
          id?: string
          requester_id: string
          estimated_total?: number | null
          expires_at?: string | null
          shop_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          thread_id?: string | null
        }
        Update: {
          build_id?: string
          created_at?: string
          details?: string | null
          id?: string
          requester_id?: string
          estimated_total?: number | null
          expires_at?: string | null
          shop_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          build_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          build_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          build_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
          owner_id: string
          state: string | null
          verified: boolean
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id: string
          state?: string | null
          verified?: boolean
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          state?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "seller" | "verified_shop"
      media_owner_type: "build" | "build_update" | "profile" | "shop"
      message_participant_role: "customer" | "shop" | "admin"
      notification_type:
        | "like"
        | "comment"
        | "save"
        | "message"
        | "quote_update"
        | "build_update"
        | "system"
      quote_status: "pending" | "in_progress" | "accepted" | "declined" | "completed"
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
      app_role: ["admin", "moderator", "user", "seller", "verified_shop"],
    },
  },
} as const
