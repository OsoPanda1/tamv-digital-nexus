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
      ai_interactions: {
        Row: {
          content: string
          created_at: string | null
          emotion: string | null
          id: string
          message_role: string | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          emotion?: string | null
          id?: string
          message_role?: string | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          emotion?: string | null
          id?: string
          message_role?: string | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          event_type: string
          id: string
          properties: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          event_type: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          event_type?: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookpi_events: {
        Row: {
          actor_id: string
          blockchain_tx: string | null
          created_at: string | null
          doi: string | null
          event_type: string
          id: string
          ipfs_cid: string | null
          legal_metadata: Json | null
          payload: Json
          resource_id: string | null
          resource_type: string
          sha3_512_hash: string
        }
        Insert: {
          actor_id: string
          blockchain_tx?: string | null
          created_at?: string | null
          doi?: string | null
          event_type: string
          id?: string
          ipfs_cid?: string | null
          legal_metadata?: Json | null
          payload?: Json
          resource_id?: string | null
          resource_type: string
          sha3_512_hash: string
        }
        Update: {
          actor_id?: string
          blockchain_tx?: string | null
          created_at?: string | null
          doi?: string | null
          event_type?: string
          id?: string
          ipfs_cid?: string | null
          legal_metadata?: Json | null
          payload?: Json
          resource_id?: string | null
          resource_type?: string
          sha3_512_hash?: string
        }
        Relationships: []
      }
      channels: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_live: boolean | null
          name: string
          owner_id: string
          stream_url: string | null
          subscriber_count: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          name: string
          owner_id: string
          stream_url?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          name?: string
          owner_id?: string
          stream_url?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      circle_gifts: {
        Row: {
          category: string | null
          combo_effects: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_available: boolean | null
          metadata: Json | null
          name: string
          price: number
          special_protocol: string | null
          visual_preview: Json | null
        }
        Insert: {
          category?: string | null
          combo_effects?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          metadata?: Json | null
          name: string
          price: number
          special_protocol?: string | null
          visual_preview?: Json | null
        }
        Update: {
          category?: string | null
          combo_effects?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number
          special_protocol?: string | null
          visual_preview?: Json | null
        }
        Relationships: []
      }
      citemesh_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          powers: string[]
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          powers?: string[]
          role?: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          powers?: string[]
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      course_certificates: {
        Row: {
          bookpi_event_id: string | null
          course_id: string
          course_title: string
          id: string
          issued_at: string
          metadata: Json | null
          user_id: string
          verification_url: string
        }
        Insert: {
          bookpi_event_id?: string | null
          course_id: string
          course_title: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          user_id: string
          verification_url: string
        }
        Update: {
          bookpi_event_id?: string | null
          course_id?: string
          course_title?: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          user_id?: string
          verification_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_free_preview: boolean
          lesson_order: number
          lesson_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_free_preview?: boolean
          lesson_order?: number
          lesson_type?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_free_preview?: boolean
          lesson_order?: number
          lesson_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string
          is_published: boolean | null
          level: string | null
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          level?: string | null
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          level?: string | null
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crisis_logs: {
        Row: {
          affected_user_id: string | null
          created_at: string | null
          description: string
          id: string
          incident_type: string
          metadata: Json | null
          recovery_actions: Json | null
          resolved_at: string | null
          rollback_details: Json | null
          rollback_executed: boolean | null
          severity: Database["public"]["Enums"]["crisis_level"]
          triggered_by: string | null
        }
        Insert: {
          affected_user_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          incident_type: string
          metadata?: Json | null
          recovery_actions?: Json | null
          resolved_at?: string | null
          rollback_details?: Json | null
          rollback_executed?: boolean | null
          severity?: Database["public"]["Enums"]["crisis_level"]
          triggered_by?: string | null
        }
        Update: {
          affected_user_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          incident_type?: string
          metadata?: Json | null
          recovery_actions?: Json | null
          resolved_at?: string | null
          rollback_details?: Json | null
          rollback_executed?: boolean | null
          severity?: Database["public"]["Enums"]["crisis_level"]
          triggered_by?: string | null
        }
        Relationships: []
      }
      dao_proposals: {
        Row: {
          author_id: string
          category: string
          created_at: string
          description: string
          evidence_hash: string | null
          expires_at: string | null
          id: string
          impact_economic: number | null
          quorum_required: number
          status: string
          title: string
          updated_at: string
          votes_against: number
          votes_for: number
        }
        Insert: {
          author_id: string
          category?: string
          created_at?: string
          description: string
          evidence_hash?: string | null
          expires_at?: string | null
          id?: string
          impact_economic?: number | null
          quorum_required?: number
          status?: string
          title: string
          updated_at?: string
          votes_against?: number
          votes_for?: number
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string
          description?: string
          evidence_hash?: string | null
          expires_at?: string | null
          id?: string
          impact_economic?: number | null
          quorum_required?: number
          status?: string
          title?: string
          updated_at?: string
          votes_against?: number
          votes_for?: number
        }
        Relationships: []
      }
      dao_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          reason: string | null
          vote: boolean
          voter_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          reason?: string | null
          vote: boolean
          voter_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          reason?: string | null
          vote?: boolean
          voter_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "dao_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "dao_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_pets: {
        Row: {
          appearance: Json | null
          created_at: string | null
          energy: number | null
          experience: number | null
          happiness: number | null
          id: string
          last_interaction: string | null
          level: number | null
          name: string
          owner_id: string
          pet_type: string | null
          traits: Json | null
        }
        Insert: {
          appearance?: Json | null
          created_at?: string | null
          energy?: number | null
          experience?: number | null
          happiness?: number | null
          id?: string
          last_interaction?: string | null
          level?: number | null
          name: string
          owner_id: string
          pet_type?: string | null
          traits?: Json | null
        }
        Update: {
          appearance?: Json | null
          created_at?: string | null
          energy?: number | null
          experience?: number | null
          happiness?: number | null
          id?: string
          last_interaction?: string | null
          level?: number | null
          name?: string
          owner_id?: string
          pet_type?: string | null
          traits?: Json | null
        }
        Relationships: []
      }
      dream_spaces: {
        Row: {
          access_level: string | null
          config: Json | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          owner_id: string
          space_type: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          config?: Json | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          owner_id: string
          space_type?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          config?: Json | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          owner_id?: string
          space_type?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dreamspaces: {
        Row: {
          access_level: string | null
          audio_config: Json | null
          config: Json | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          owner_id: string
          space_type: string | null
          theme: string | null
          updated_at: string | null
          visual_effects: Json | null
          xr_assets: Json | null
        }
        Insert: {
          access_level?: string | null
          audio_config?: Json | null
          config?: Json | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          owner_id: string
          space_type?: string | null
          theme?: string | null
          updated_at?: string | null
          visual_effects?: Json | null
          xr_assets?: Json | null
        }
        Update: {
          access_level?: string | null
          audio_config?: Json | null
          config?: Json | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          owner_id?: string
          space_type?: string | null
          theme?: string | null
          updated_at?: string | null
          visual_effects?: Json | null
          xr_assets?: Json | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          current_attendees: number | null
          description: string | null
          dream_space_id: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_featured: boolean | null
          location_type: string | null
          max_attendees: number | null
          organizer_id: string
          start_time: string
          ticket_price: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          dream_space_id?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_featured?: boolean | null
          location_type?: string | null
          max_attendees?: number | null
          organizer_id: string
          start_time: string
          ticket_price?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          dream_space_id?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_featured?: boolean | null
          location_type?: string | null
          max_attendees?: number | null
          organizer_id?: string
          start_time?: string
          ticket_price?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_dream_space_id_fkey"
            columns: ["dream_space_id"]
            isOneToOne: false
            referencedRelation: "dream_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_transactions: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          gift_id: string | null
          id: string
          message: string | null
          quantity: number | null
          receiver_id: string
          sender_id: string
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          gift_id?: string | null
          id?: string
          message?: string | null
          quantity?: number | null
          receiver_id: string
          sender_id: string
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          gift_id?: string | null
          id?: string
          message?: string | null
          quantity?: number | null
          receiver_id?: string
          sender_id?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "circle_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          member_count: number | null
          name: string
          owner_id: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
          owner_id: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
          owner_id?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      hyperreal_effects: {
        Row: {
          ai_driven: boolean | null
          audio_reactive: boolean | null
          created_at: string | null
          effect_type: string
          id: string
          name: string
          parameters: Json | null
          preview_url: string | null
          shader_code: string | null
        }
        Insert: {
          ai_driven?: boolean | null
          audio_reactive?: boolean | null
          created_at?: string | null
          effect_type: string
          id?: string
          name: string
          parameters?: Json | null
          preview_url?: string | null
          shader_code?: string | null
        }
        Update: {
          ai_driven?: boolean | null
          audio_reactive?: boolean | null
          created_at?: string | null
          effect_type?: string
          id?: string
          name?: string
          parameters?: Json | null
          preview_url?: string | null
          shader_code?: string | null
        }
        Relationships: []
      }
      id_nvida: {
        Row: {
          biometric_hash: string | null
          created_at: string
          dignity_score: number
          emotional_fingerprint: Json | null
          id: string
          immutable_username: string | null
          last_dignity_decay: string | null
          reputation_score: number
          status: string
          trust_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          biometric_hash?: string | null
          created_at?: string
          dignity_score?: number
          emotional_fingerprint?: Json | null
          id?: string
          immutable_username?: string | null
          last_dignity_decay?: string | null
          reputation_score?: number
          status?: string
          trust_level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          biometric_hash?: string | null
          created_at?: string
          dignity_score?: number
          emotional_fingerprint?: Json | null
          id?: string
          immutable_username?: string | null
          last_dignity_decay?: string | null
          reputation_score?: number
          status?: string
          trust_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      isabella_interactions: {
        Row: {
          content: string
          created_at: string | null
          emotion_vector: Json | null
          ethical_flag: string | null
          id: string
          intent_analysis: Json | null
          message_role: string
          metadata: Json | null
          recommended_effects: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          emotion_vector?: Json | null
          ethical_flag?: string | null
          id?: string
          intent_analysis?: Json | null
          message_role: string
          metadata?: Json | null
          recommended_effects?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          emotion_vector?: Json | null
          ethical_flag?: string | null
          id?: string
          intent_analysis?: Json | null
          message_role?: string
          metadata?: Json | null
          recommended_effects?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      lottery_draws: {
        Row: {
          created_at: string
          draw_date: string | null
          draw_name: string
          id: string
          max_tickets: number
          prize_pool: number
          status: string
          ticket_price_usd: number
          tickets_sold: number
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          draw_date?: string | null
          draw_name: string
          id?: string
          max_tickets?: number
          prize_pool?: number
          status?: string
          ticket_price_usd?: number
          tickets_sold?: number
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          draw_date?: string | null
          draw_name?: string
          id?: string
          max_tickets?: number
          prize_pool?: number
          status?: string
          ticket_price_usd?: number
          tickets_sold?: number
          winner_id?: string | null
        }
        Relationships: []
      }
      lottery_tickets: {
        Row: {
          created_at: string
          draw_id: string
          id: string
          ticket_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          draw_id: string
          id?: string
          ticket_number: number
          user_id: string
        }
        Update: {
          created_at?: string
          draw_id?: string
          id?: string
          ticket_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_tickets_draw_id_fkey"
            columns: ["draw_id"]
            isOneToOne: false
            referencedRelation: "lottery_draws"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          item_type: string | null
          price: number
          seller_id: string
          stock: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          item_type?: string | null
          price: number
          seller_id: string
          stock?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          item_type?: string | null
          price?: number
          seller_id?: string
          stock?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          start_date: string
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          start_date?: string
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          start_date?: string
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      msr_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          domain: string
          evidence_hash: string
          id: string
          parent_hash: string | null
          payload: Json | null
          severity: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          domain?: string
          evidence_hash: string
          id?: string
          parent_hash?: string | null
          payload?: Json | null
          severity?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          domain?: string
          evidence_hash?: string
          id?: string
          parent_hash?: string | null
          payload?: Json | null
          severity?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          audio_signature: string | null
          category: string
          celebrated: boolean | null
          created_at: string | null
          emotional_tone: string | null
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
          visual_effect: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          audio_signature?: string | null
          category?: string
          celebrated?: boolean | null
          created_at?: string | null
          emotional_tone?: string | null
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
          visual_effect?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          audio_signature?: string | null
          category?: string
          celebrated?: boolean | null
          created_at?: string | null
          emotional_tone?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          visual_effect?: string | null
        }
        Relationships: []
      }
      pi_consents: {
        Row: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at: string | null
          doi: string | null
          granted: boolean
          granted_at: string | null
          id: string
          metadata: Json | null
          purpose: string | null
          revoked_at: string | null
          scope: Json | null
          sha3_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          doi?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
          revoked_at?: string | null
          scope?: Json | null
          sha3_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consent_type?: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          doi?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
          revoked_at?: string | null
          scope?: Json | null
          sha3_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          media_type: string | null
          media_url: string | null
          shares_count: number | null
          tags: string[] | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          shares_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          shares_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          membership_tier: string | null
          role: string | null
          updated_at: string | null
          user_id: string
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          membership_tier?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          membership_tier?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_balance?: number | null
        }
        Relationships: []
      }
      security_scans: {
        Row: {
          action_taken: string | null
          created_at: string | null
          details: Json | null
          id: string
          scan_type: string | null
          threat_level: string | null
          user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          scan_type?: string | null
          threat_level?: string | null
          user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          scan_type?: string | null
          threat_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tcep_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          evidence_hash: string | null
          from_user_id: string | null
          id: string
          metadata: Json | null
          to_user_id: string | null
          tx_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          evidence_hash?: string | null
          from_user_id?: string | null
          id?: string
          metadata?: Json | null
          to_user_id?: string | null
          tx_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          evidence_hash?: string | null
          from_user_id?: string | null
          id?: string
          metadata?: Json | null
          to_user_id?: string | null
          tx_type?: string
        }
        Relationships: []
      }
      tcep_wallets: {
        Row: {
          balance_credits: number
          balance_locked: number
          commission_rate: number
          created_at: string
          id: string
          lifetime_earned: number
          lifetime_spent: number
          membership_tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_credits?: number
          balance_locked?: number
          commission_rate?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          membership_tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_credits?: number
          balance_locked?: number
          commission_rate?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          membership_tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          status: string | null
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_bookpi_event: {
        Args: {
          p_actor_id: string
          p_event_type: string
          p_payload: Json
          p_resource_id: string
          p_resource_type: string
        }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      trigger_crisis_rollback: {
        Args: {
          p_affected_user_id?: string
          p_description: string
          p_incident_type: string
          p_severity: Database["public"]["Enums"]["crisis_level"]
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "user" | "creator" | "pro" | "admin" | "moderator"
      consent_type:
        | "biometric"
        | "voice"
        | "image"
        | "video"
        | "creative_work"
        | "data_processing"
        | "ai_training"
        | "marketplace"
        | "publishing"
      crisis_level: "low" | "medium" | "high" | "critical"
      membership_tier:
        | "free"
        | "pro"
        | "gold"
        | "gold_18"
        | "celestial"
        | "enterprise"
        | "institutional"
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
      app_role: ["user", "creator", "pro", "admin", "moderator"],
      consent_type: [
        "biometric",
        "voice",
        "image",
        "video",
        "creative_work",
        "data_processing",
        "ai_training",
        "marketplace",
        "publishing",
      ],
      crisis_level: ["low", "medium", "high", "critical"],
      membership_tier: [
        "free",
        "pro",
        "gold",
        "gold_18",
        "celestial",
        "enterprise",
        "institutional",
      ],
    },
  },
} as const
