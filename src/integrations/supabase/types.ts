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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      absences: {
        Row: {
          absence_date: string
          company_id: string
          created_at: string
          id: string
          is_full_day: boolean | null
          is_justified: boolean | null
          metadata: Json | null
          notified_via: string | null
          parent_notified_at: string | null
          period: string | null
          reason: string | null
          student_id: string
        }
        Insert: {
          absence_date: string
          company_id: string
          created_at?: string
          id?: string
          is_full_day?: boolean | null
          is_justified?: boolean | null
          metadata?: Json | null
          notified_via?: string | null
          parent_notified_at?: string | null
          period?: string | null
          reason?: string | null
          student_id: string
        }
        Update: {
          absence_date?: string
          company_id?: string
          created_at?: string
          id?: string
          is_full_day?: boolean | null
          is_justified?: boolean | null
          metadata?: Json | null
          notified_via?: string | null
          parent_notified_at?: string | null
          period?: string | null
          reason?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "absences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "absences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "absences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_seen_at: string | null
          metadata: Json | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      ai_actions_log: {
        Row: {
          action_type: string
          company_id: string
          created_at: string
          duration_ms: number | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          executed_at: string
          id: string
          input_data: Json | null
          output_data: Json | null
          status: Database["public"]["Enums"]["ai_action_status"]
          trigger_source: string
        }
        Insert: {
          action_type: string
          company_id: string
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          executed_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: Database["public"]["Enums"]["ai_action_status"]
          trigger_source: string
        }
        Update: {
          action_type?: string
          company_id?: string
          created_at?: string
          duration_ms?: number | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          executed_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: Database["public"]["Enums"]["ai_action_status"]
          trigger_source?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_actions_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_actions_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_actions_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "ai_actions_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      ai_chatbox_prompts: {
        Row: {
          available_actions: Json
          config: Json | null
          created_at: string | null
          few_shot_examples: Json | null
          id: string
          is_active: boolean
          sector: string
          system_prompt: string
          updated_at: string | null
          version: number
        }
        Insert: {
          available_actions?: Json
          config?: Json | null
          created_at?: string | null
          few_shot_examples?: Json | null
          id?: string
          is_active?: boolean
          sector: string
          system_prompt: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          available_actions?: Json
          config?: Json | null
          created_at?: string | null
          few_shot_examples?: Json | null
          id?: string
          is_active?: boolean
          sector?: string
          system_prompt?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      ai_session_context: {
        Row: {
          company_id: string
          conversation_stage: string | null
          created_at: string | null
          current_intent: string | null
          extracted_data: Json
          id: string
          messages: Json
          sentiment: string | null
          session_id: string
          turn_count: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          conversation_stage?: string | null
          created_at?: string | null
          current_intent?: string | null
          extracted_data?: Json
          id?: string
          messages?: Json
          sentiment?: string | null
          session_id: string
          turn_count?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          conversation_stage?: string | null
          created_at?: string | null
          current_intent?: string | null
          extracted_data?: Json
          id?: string
          messages?: Json
          sentiment?: string | null
          session_id?: string
          turn_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_session_context_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_logs: {
        Row: {
          channel: string | null
          company_id: string
          created_at: string
          data: Json | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          company_id: string
          created_at?: string
          data?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          company_id?: string
          created_at?: string
          data?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "analytics_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          booked_via: string | null
          calendar_event_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          chief_complaint: string | null
          company_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          doctor_id: string
          duration_min: number | null
          id: string
          metadata: Json | null
          notes: string | null
          patient_id: string
          reminder_sent_at: string | null
          specialty: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          urgency_level: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          booked_via?: string | null
          calendar_event_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          chief_complaint?: string | null
          company_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          doctor_id: string
          duration_min?: number | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          patient_id: string
          reminder_sent_at?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          urgency_level?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          booked_via?: string | null
          calendar_event_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          chief_complaint?: string | null
          company_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          doctor_id?: string
          duration_min?: number | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          patient_id?: string
          reminder_sent_at?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          urgency_level?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_learning: {
        Row: {
          added_to_flow: boolean
          added_to_flow_at: string | null
          chatbot_id: string | null
          company_id: string
          confidence_score: number | null
          created_at: string
          detected_intent: string | null
          id: string
          is_reviewed: boolean
          message_id: string | null
          metadata: Json | null
          raw_message: string
          resolution_notes: string | null
          resolved_intent: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          session_id: string | null
        }
        Insert: {
          added_to_flow?: boolean
          added_to_flow_at?: string | null
          chatbot_id?: string | null
          company_id: string
          confidence_score?: number | null
          created_at?: string
          detected_intent?: string | null
          id?: string
          is_reviewed?: boolean
          message_id?: string | null
          metadata?: Json | null
          raw_message: string
          resolution_notes?: string | null
          resolved_intent?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          session_id?: string | null
        }
        Update: {
          added_to_flow?: boolean
          added_to_flow_at?: string | null
          chatbot_id?: string | null
          company_id?: string
          confidence_score?: number | null
          created_at?: string
          detected_intent?: string | null
          id?: string
          is_reviewed?: boolean
          message_id?: string | null
          metadata?: Json | null
          raw_message?: string
          resolution_notes?: string | null
          resolved_intent?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_learning_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_learning_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "v_chatbot_whatsapp"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "chat_learning_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_learning_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_learning_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chat_learning_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chat_learning_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_learning_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chatbot_id: string
          client_id: string | null
          company_id: string
          content: string
          created_at: string
          direction: string
          escalated_at: string | null
          id: string
          is_escalated: boolean
          message_type: string
          metadata: Json | null
          node_id: string | null
          session_id: string
        }
        Insert: {
          chatbot_id: string
          client_id?: string | null
          company_id: string
          content: string
          created_at?: string
          direction: string
          escalated_at?: string | null
          id?: string
          is_escalated?: boolean
          message_type?: string
          metadata?: Json | null
          node_id?: string | null
          session_id: string
        }
        Update: {
          chatbot_id?: string
          client_id?: string | null
          company_id?: string
          content?: string
          created_at?: string
          direction?: string
          escalated_at?: string | null
          id?: string
          is_escalated?: boolean
          message_type?: string
          metadata?: Json | null
          node_id?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "v_chatbot_whatsapp"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "chat_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          chatbot_id: string
          client_name: string | null
          client_phone: string
          company_id: string
          created_at: string
          current_node_id: string
          id: string
          last_message_at: string
          status: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          chatbot_id: string
          client_name?: string | null
          client_phone: string
          company_id: string
          created_at?: string
          current_node_id?: string
          id?: string
          last_message_at?: string
          status?: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          chatbot_id?: string
          client_name?: string | null
          client_phone?: string
          company_id?: string
          created_at?: string
          current_node_id?: string
          id?: string
          last_message_at?: string
          status?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "v_chatbot_whatsapp"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      chatbots: {
        Row: {
          channel: Database["public"]["Enums"]["chatbot_channel"]
          company_id: string
          created_at: string
          description: string | null
          escalation_delay_sec: number | null
          escalation_email: string | null
          escalation_message: string | null
          escalation_phone: string | null
          fallback_message: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          sector_template: Database["public"]["Enums"]["chatbot_template"]
          settings: Json | null
          total_conversions: number | null
          total_escalations: number | null
          total_interactions: number | null
          updated_at: string
          welcome_message: string | null
          whatsapp_phone_id: string | null
          whatsapp_phone_number_id: string | null
          whatsapp_verify_token: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["chatbot_channel"]
          company_id: string
          created_at?: string
          description?: string | null
          escalation_delay_sec?: number | null
          escalation_email?: string | null
          escalation_message?: string | null
          escalation_phone?: string | null
          fallback_message?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          sector_template?: Database["public"]["Enums"]["chatbot_template"]
          settings?: Json | null
          total_conversions?: number | null
          total_escalations?: number | null
          total_interactions?: number | null
          updated_at?: string
          welcome_message?: string | null
          whatsapp_phone_id?: string | null
          whatsapp_phone_number_id?: string | null
          whatsapp_verify_token?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["chatbot_channel"]
          company_id?: string
          created_at?: string
          description?: string | null
          escalation_delay_sec?: number | null
          escalation_email?: string | null
          escalation_message?: string | null
          escalation_phone?: string | null
          fallback_message?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          sector_template?: Database["public"]["Enums"]["chatbot_template"]
          settings?: Json | null
          total_conversions?: number | null
          total_escalations?: number | null
          total_interactions?: number | null
          updated_at?: string
          welcome_message?: string | null
          whatsapp_phone_id?: string | null
          whatsapp_phone_number_id?: string | null
          whatsapp_verify_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      chatbox_usage_logs: {
        Row: {
          avg_session_length: number | null
          chatbot_id: string
          company_id: string
          created_at: string
          id: string
          log_date: string
          metadata: Json | null
          total_conversions: number | null
          total_escalations: number | null
          total_messages: number | null
          total_sessions: number | null
        }
        Insert: {
          avg_session_length?: number | null
          chatbot_id: string
          company_id: string
          created_at?: string
          id?: string
          log_date: string
          metadata?: Json | null
          total_conversions?: number | null
          total_escalations?: number | null
          total_messages?: number | null
          total_sessions?: number | null
        }
        Update: {
          avg_session_length?: number | null
          chatbot_id?: string
          company_id?: string
          created_at?: string
          id?: string
          log_date?: string
          metadata?: Json | null
          total_conversions?: number | null
          total_escalations?: number | null
          total_messages?: number | null
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbox_usage_logs_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbox_usage_logs_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "v_chatbot_whatsapp"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "chatbox_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbox_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbox_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chatbox_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      chatflows: {
        Row: {
          chatbot_id: string
          company_id: string
          connections: Json
          created_at: string
          id: string
          is_published: boolean
          metadata: Json | null
          nodes: Json
          published_at: string | null
          updated_at: string
          version: number
        }
        Insert: {
          chatbot_id: string
          company_id: string
          connections?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          metadata?: Json | null
          nodes?: Json
          published_at?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          chatbot_id?: string
          company_id?: string
          connections?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          metadata?: Json | null
          nodes?: Json
          published_at?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "chatflows_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatflows_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "v_chatbot_whatsapp"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "chatflows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatflows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatflows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chatflows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      clients: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_interaction_at: string | null
          notes: string | null
          phone: string | null
          sector_metadata: Json | null
          tags: string[] | null
          total_interactions: number | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string | null
          notes?: string | null
          phone?: string | null
          sector_metadata?: Json | null
          tags?: string[] | null
          total_interactions?: number | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string | null
          notes?: string | null
          phone?: string | null
          sector_metadata?: Json | null
          tags?: string[] | null
          total_interactions?: number | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      companies: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          calendar_provider: string | null
          city: string | null
          country: string
          created_at: string
          deactivated_at: string | null
          deactivated_reason: string | null
          email: string | null
          gmail_address: string | null
          id: string
          internal_notes: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          onboarding_completed: boolean | null
          onboarding_email_sent_at: string | null
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          phone: string | null
          plan_notes: string | null
          preferred_channel: string | null
          sector: Database["public"]["Enums"]["sector_type"]
          settings: Json | null
          status: Database["public"]["Enums"]["company_status"]
          updated_at: string
          website: string | null
          whatsapp_business_account_id: string | null
          whatsapp_business_id: string | null
          whatsapp_number: string | null
          whatsapp_phone_id: string | null
          whatsapp_phone_number_id: string | null
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          calendar_provider?: string | null
          city?: string | null
          country: string
          created_at?: string
          deactivated_at?: string | null
          deactivated_reason?: string | null
          email?: string | null
          gmail_address?: string | null
          id?: string
          internal_notes?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          onboarding_completed?: boolean | null
          onboarding_email_sent_at?: string | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          phone?: string | null
          plan_notes?: string | null
          preferred_channel?: string | null
          sector: Database["public"]["Enums"]["sector_type"]
          settings?: Json | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          website?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_business_id?: string | null
          whatsapp_number?: string | null
          whatsapp_phone_id?: string | null
          whatsapp_phone_number_id?: string | null
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          calendar_provider?: string | null
          city?: string | null
          country?: string
          created_at?: string
          deactivated_at?: string | null
          deactivated_reason?: string | null
          email?: string | null
          gmail_address?: string | null
          id?: string
          internal_notes?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          onboarding_completed?: boolean | null
          onboarding_email_sent_at?: string | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          phone?: string | null
          plan_notes?: string | null
          preferred_channel?: string | null
          sector?: Database["public"]["Enums"]["sector_type"]
          settings?: Json | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          website?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_business_id?: string | null
          whatsapp_number?: string | null
          whatsapp_phone_id?: string | null
          whatsapp_phone_number_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_activated_by"
            columns: ["activated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_activity_logs: {
        Row: {
          actor_id: string | null
          actor_type: string | null
          company_id: string
          created_at: string
          data: Json | null
          description: string | null
          event_type: string
          id: string
          ip_address: unknown
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string | null
          company_id: string
          created_at?: string
          data?: Json | null
          description?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
        }
        Update: {
          actor_id?: string | null
          actor_type?: string | null
          company_id?: string
          created_at?: string
          data?: Json | null
          description?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "company_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_secrets: {
        Row: {
          company_id: string
          created_at: string
          updated_at: string
          whatsapp_access_token: string | null
          whatsapp_verify_token: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          updated_at?: string
          whatsapp_access_token?: string | null
          whatsapp_verify_token?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          updated_at?: string
          whatsapp_access_token?: string | null
          whatsapp_verify_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_secrets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_secrets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_secrets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_secrets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_status_logs: {
        Row: {
          changed_by: string
          company_id: string
          created_at: string
          id: string
          metadata: Json | null
          new_status: Database["public"]["Enums"]["company_status"]
          old_status: Database["public"]["Enums"]["company_status"] | null
          reason: string | null
        }
        Insert: {
          changed_by: string
          company_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status: Database["public"]["Enums"]["company_status"]
          old_status?: Database["public"]["Enums"]["company_status"] | null
          reason?: string | null
        }
        Update: {
          changed_by?: string
          company_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["company_status"]
          old_status?: Database["public"]["Enums"]["company_status"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_status_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_status_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_status_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_status_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_status_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      consultations: {
        Row: {
          appointment_id: string
          attachments: Json | null
          company_id: string
          consultation_date: string
          consultation_fee: number | null
          created_at: string
          diagnosis: string | null
          diagnosis_codes: string[] | null
          doctor_id: string
          follow_up_date: string | null
          follow_up_needed: boolean | null
          follow_up_notes: string | null
          id: string
          lab_orders: Json | null
          metadata: Json | null
          patient_id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          prescriptions: Json | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          attachments?: Json | null
          company_id: string
          consultation_date: string
          consultation_fee?: number | null
          created_at?: string
          diagnosis?: string | null
          diagnosis_codes?: string[] | null
          doctor_id: string
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          follow_up_notes?: string | null
          id?: string
          lab_orders?: Json | null
          metadata?: Json | null
          patient_id: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescriptions?: Json | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          attachments?: Json | null
          company_id?: string
          consultation_date?: string
          consultation_fee?: number | null
          created_at?: string
          diagnosis?: string | null
          diagnosis_codes?: string[] | null
          doctor_id?: string
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          follow_up_notes?: string | null
          id?: string
          lab_orders?: Json | null
          metadata?: Json | null
          patient_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescriptions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "v_clinic_today"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "consultations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "consultations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          availability: Json | null
          bio: string | null
          company_id: string
          consultation_fee: number | null
          created_at: string
          currency: string | null
          first_name: string
          id: string
          is_active: boolean | null
          languages: string[] | null
          last_name: string
          metadata: Json | null
          photo_url: string | null
          registration_number: string | null
          specialty: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          company_id: string
          consultation_fee?: number | null
          created_at?: string
          currency?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_name: string
          metadata?: Json | null
          photo_url?: string | null
          registration_number?: string | null
          specialty: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          company_id?: string
          consultation_fee?: number | null
          created_at?: string
          currency?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          last_name?: string
          metadata?: Json | null
          photo_url?: string | null
          registration_number?: string | null
          specialty?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "doctors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "doctors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_year: string
          comment: string | null
          company_id: string
          created_at: string
          grade: number
          grade_date: string | null
          id: string
          max_grade: number
          metadata: Json | null
          student_id: string
          subject: string
          teacher_id: string | null
          term: Database["public"]["Enums"]["academic_term"]
        }
        Insert: {
          academic_year: string
          comment?: string | null
          company_id: string
          created_at?: string
          grade: number
          grade_date?: string | null
          id?: string
          max_grade?: number
          metadata?: Json | null
          student_id: string
          subject: string
          teacher_id?: string | null
          term: Database["public"]["Enums"]["academic_term"]
        }
        Update: {
          academic_year?: string
          comment?: string | null
          company_id?: string
          created_at?: string
          grade?: number
          grade_date?: string | null
          id?: string
          max_grade?: number
          metadata?: Json | null
          student_id?: string
          subject?: string
          teacher_id?: string | null
          term?: Database["public"]["Enums"]["academic_term"]
        }
        Relationships: [
          {
            foreignKeyName: "grades_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "grades_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_alerts: {
        Row: {
          alert_type: string
          auto_resolved: boolean | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_read: boolean
          is_resolved: boolean
          metadata: Json | null
          metric_value: number | null
          read_at: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          threshold_value: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          auto_resolved?: boolean | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          metadata?: Json | null
          metric_value?: number | null
          read_at?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          threshold_value?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          auto_resolved?: boolean | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          metadata?: Json | null
          metric_value?: number | null
          read_at?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          threshold_value?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insight_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insight_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_recommendations: {
        Row: {
          action_data: Json | null
          action_label: string | null
          action_type: string | null
          applied_at: string | null
          category: string
          company_id: string
          created_at: string
          description: string | null
          dismissed_at: string | null
          dismissed_by: string | null
          expires_at: string | null
          id: string
          is_applied: boolean
          is_dismissed: boolean
          metadata: Json | null
          priority: number
          related_alert_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_data?: Json | null
          action_label?: string | null
          action_type?: string | null
          applied_at?: string | null
          category: string
          company_id: string
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          dismissed_by?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean
          is_dismissed?: boolean
          metadata?: Json | null
          priority?: number
          related_alert_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_data?: Json | null
          action_label?: string | null
          action_type?: string | null
          applied_at?: string | null
          category?: string
          company_id?: string
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          dismissed_by?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean
          is_dismissed?: boolean
          metadata?: Json | null
          priority?: number
          related_alert_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insight_recommendations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insight_recommendations_dismissed_by_fkey"
            columns: ["dismissed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_recommendations_related_alert_id_fkey"
            columns: ["related_alert_id"]
            isOneToOne: false
            referencedRelation: "insight_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_scores: {
        Row: {
          automation_score: number | null
          company_id: string
          created_at: string
          engagement_score: number | null
          growth_score: number | null
          id: string
          overall_score: number | null
          previous_overall: number | null
          retention_score: number | null
          score_breakdown: Json | null
          score_date: string
          updated_at: string | null
        }
        Insert: {
          automation_score?: number | null
          company_id: string
          created_at?: string
          engagement_score?: number | null
          growth_score?: number | null
          id?: string
          overall_score?: number | null
          previous_overall?: number | null
          retention_score?: number | null
          score_breakdown?: Json | null
          score_date: string
          updated_at?: string | null
        }
        Update: {
          automation_score?: number | null
          company_id?: string
          created_at?: string
          engagement_score?: number | null
          growth_score?: number | null
          id?: string
          overall_score?: number | null
          previous_overall?: number | null
          retention_score?: number | null
          score_breakdown?: Json | null
          score_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insight_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      lead_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string
          id: string
          lead_id: string
          notes: string | null
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          bot_field: string | null
          business_name: string
          converted_at: string | null
          converted_company_id: string | null
          country: string | null
          created_at: string
          email: string | null
          email_notified_at: string | null
          followup_count: number | null
          id: string
          last_followup_at: string | null
          main_need: string | null
          metadata: Json | null
          notes: string | null
          phone: string
          score: number | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          whatsapp_notified_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          bot_field?: string | null
          business_name: string
          converted_at?: string | null
          converted_company_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_notified_at?: string | null
          followup_count?: number | null
          id?: string
          last_followup_at?: string | null
          main_need?: string | null
          metadata?: Json | null
          notes?: string | null
          phone: string
          score?: number | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          whatsapp_notified_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          bot_field?: string | null
          business_name?: string
          converted_at?: string | null
          converted_company_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_notified_at?: string | null
          followup_count?: number | null
          id?: string
          last_followup_at?: string | null
          main_need?: string | null
          metadata?: Json | null
          notes?: string | null
          phone?: string
          score?: number | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          whatsapp_notified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "leads_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string
          company_id: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          metadata: Json | null
          name: string
          price: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          metadata?: Json | null
          name: string
          price: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          metadata?: Json | null
          name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "menu_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      orders: {
        Row: {
          channel: Database["public"]["Enums"]["order_channel"]
          client_id: string | null
          company_id: string
          created_at: string
          currency: string | null
          delivery_address: string | null
          delivery_fee: number | null
          id: string
          items: Json
          metadata: Json | null
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["order_status"]
          table_ref: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["order_channel"]
          client_id?: string | null
          company_id: string
          created_at?: string
          currency?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          id?: string
          items?: Json
          metadata?: Json | null
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["order_status"]
          table_ref?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["order_channel"]
          client_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          id?: string
          items?: Json
          metadata?: Json | null
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["order_status"]
          table_ref?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: Json | null
          birth_date: string | null
          blood_type: string | null
          chronic_conditions: Json | null
          client_id: string | null
          company_id: string
          created_at: string
          current_medications: Json | null
          email: string | null
          emergency_contact: Json | null
          first_name: string
          gender: string | null
          id: string
          insurance_id: string | null
          insurance_provider: string | null
          last_name: string
          metadata: Json | null
          patient_number: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          allergies?: Json | null
          birth_date?: string | null
          blood_type?: string | null
          chronic_conditions?: Json | null
          client_id?: string | null
          company_id: string
          created_at?: string
          current_medications?: Json | null
          email?: string | null
          emergency_contact?: Json | null
          first_name: string
          gender?: string | null
          id?: string
          insurance_id?: string | null
          insurance_provider?: string | null
          last_name: string
          metadata?: Json | null
          patient_number?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          allergies?: Json | null
          birth_date?: string | null
          blood_type?: string | null
          chronic_conditions?: Json | null
          client_id?: string | null
          company_id?: string
          created_at?: string
          current_medications?: Json | null
          email?: string | null
          emergency_contact?: Json | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance_id?: string | null
          insurance_provider?: string | null
          last_name?: string
          metadata?: Json | null
          patient_number?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "patients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          assigned_agent_id: string | null
          bathrooms: number | null
          bedrooms: number | null
          company_id: string
          created_at: string
          currency: string | null
          description: string | null
          floor: number | null
          id: string
          images: Json | null
          latitude: number | null
          listing_type: string
          location: string
          longitude: number | null
          metadata: Json | null
          price: number | null
          reference: string | null
          rent_price: number | null
          rooms: number | null
          status: Database["public"]["Enums"]["property_status"]
          surface_m2: number | null
          title: string
          type: Database["public"]["Enums"]["property_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_agent_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          company_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          floor?: number | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_type?: string
          location: string
          longitude?: number | null
          metadata?: Json | null
          price?: number | null
          reference?: string | null
          rent_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          surface_m2?: number | null
          title: string
          type: Database["public"]["Enums"]["property_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_agent_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          company_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          floor?: number | null
          id?: string
          images?: Json | null
          latitude?: number | null
          listing_type?: string
          location?: string
          longitude?: number | null
          metadata?: Json | null
          price?: number | null
          reference?: string | null
          rent_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          surface_m2?: number | null
          title?: string
          type?: Database["public"]["Enums"]["property_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      property_leads: {
        Row: {
          assigned_agent_id: string | null
          budget_max: number | null
          budget_min: number | null
          client_id: string | null
          company_id: string
          created_at: string
          followup_count: number | null
          id: string
          is_pre_approved: boolean | null
          last_contact_at: string | null
          lead_type: Database["public"]["Enums"]["lead_type"]
          metadata: Json | null
          notes: string | null
          pipeline_stage: Database["public"]["Enums"]["property_lead_stage"]
          preferred_zones: string[] | null
          property_id: string | null
          property_types: Database["public"]["Enums"]["property_type"][] | null
          score: number | null
          timeline: string | null
          updated_at: string
          visit_date: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string | null
          company_id: string
          created_at?: string
          followup_count?: number | null
          id?: string
          is_pre_approved?: boolean | null
          last_contact_at?: string | null
          lead_type?: Database["public"]["Enums"]["lead_type"]
          metadata?: Json | null
          notes?: string | null
          pipeline_stage?: Database["public"]["Enums"]["property_lead_stage"]
          preferred_zones?: string[] | null
          property_id?: string | null
          property_types?: Database["public"]["Enums"]["property_type"][] | null
          score?: number | null
          timeline?: string | null
          updated_at?: string
          visit_date?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string | null
          company_id?: string
          created_at?: string
          followup_count?: number | null
          id?: string
          is_pre_approved?: boolean | null
          last_contact_at?: string | null
          lead_type?: Database["public"]["Enums"]["lead_type"]
          metadata?: Json | null
          notes?: string | null
          pipeline_stage?: Database["public"]["Enums"]["property_lead_stage"]
          preferred_zones?: string[] | null
          property_id?: string | null
          property_types?: Database["public"]["Enums"]["property_type"][] | null
          score?: number | null
          timeline?: string | null
          updated_at?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "property_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string
          confirmed_at: string | null
          covers: number
          created_at: string
          id: string
          metadata: Json | null
          reminder_sent_at: string | null
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          confirmed_at?: string | null
          covers?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reminder_sent_at?: string | null
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          confirmed_at?: string | null
          covers?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reminder_sent_at?: string | null
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      school_classes: {
        Row: {
          academic_year: string
          capacity: number | null
          company_id: string
          created_at: string
          current_count: number | null
          homeroom_teacher_id: string | null
          id: string
          level: string
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          capacity?: number | null
          company_id: string
          created_at?: string
          current_count?: number | null
          homeroom_teacher_id?: string | null
          id?: string
          level: string
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          capacity?: number | null
          company_id?: string
          created_at?: string
          current_count?: number | null
          homeroom_teacher_id?: string | null
          id?: string
          level?: string
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_homeroom_teacher"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "school_classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          price: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      staff_members: {
        Row: {
          class_ids: string[] | null
          company_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          metadata: Json | null
          phone: string | null
          role: string
          subjects: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          class_ids?: string[] | null
          company_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          metadata?: Json | null
          phone?: string | null
          role: string
          subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          class_ids?: string[] | null
          company_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          metadata?: Json | null
          phone?: string | null
          role?: string
          subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          birth_date: string | null
          class_id: string | null
          client_id: string | null
          company_id: string
          created_at: string
          enrollment_year: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          medical_notes: string | null
          metadata: Json | null
          parent_email: string | null
          parent_names: string | null
          parent_phone: string | null
          parent_whatsapp: string | null
          status: Database["public"]["Enums"]["student_status"]
          student_number: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          class_id?: string | null
          client_id?: string | null
          company_id: string
          created_at?: string
          enrollment_year: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          medical_notes?: string | null
          metadata?: Json | null
          parent_email?: string | null
          parent_names?: string | null
          parent_phone?: string | null
          parent_whatsapp?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          student_number?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          class_id?: string | null
          client_id?: string | null
          company_id?: string
          created_at?: string
          enrollment_year?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          medical_notes?: string | null
          metadata?: Json | null
          parent_email?: string | null
          parent_names?: string | null
          parent_phone?: string | null
          parent_whatsapp?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          student_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      trip_bookings: {
        Row: {
          balance_due_date: string | null
          balance_paid_at: string | null
          booking_reference: string
          client_id: string | null
          company_id: string
          created_at: string
          currency: string | null
          departure_date: string
          deposit_amount: number | null
          deposit_paid_at: string | null
          documents: Json | null
          id: string
          metadata: Json | null
          package_id: string | null
          reminder_sent_at: string | null
          return_date: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          traveler_count: number
          travelers: Json
          updated_at: string
        }
        Insert: {
          balance_due_date?: string | null
          balance_paid_at?: string | null
          booking_reference: string
          client_id?: string | null
          company_id: string
          created_at?: string
          currency?: string | null
          departure_date: string
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          documents?: Json | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          reminder_sent_at?: string | null
          return_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          traveler_count?: number
          travelers?: Json
          updated_at?: string
        }
        Update: {
          balance_due_date?: string | null
          balance_paid_at?: string | null
          booking_reference?: string
          client_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string | null
          departure_date?: string
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          documents?: Json | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          reminder_sent_at?: string | null
          return_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          traveler_count?: number
          travelers?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "trip_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "trip_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trip_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_packages: {
        Row: {
          available_dates: Json | null
          company_id: string
          country_code: string | null
          created_at: string
          currency: string | null
          destination: string
          duration_days: number
          excludes: Json | null
          highlights: Json | null
          id: string
          images: Json | null
          includes: Json | null
          is_available: boolean | null
          itinerary: Json | null
          max_travelers: number | null
          metadata: Json | null
          min_travelers: number | null
          price_per_person: number
          title: string
          trip_type: string
          updated_at: string
        }
        Insert: {
          available_dates?: Json | null
          company_id: string
          country_code?: string | null
          created_at?: string
          currency?: string | null
          destination: string
          duration_days: number
          excludes?: Json | null
          highlights?: Json | null
          id?: string
          images?: Json | null
          includes?: Json | null
          is_available?: boolean | null
          itinerary?: Json | null
          max_travelers?: number | null
          metadata?: Json | null
          min_travelers?: number | null
          price_per_person: number
          title: string
          trip_type: string
          updated_at?: string
        }
        Update: {
          available_dates?: Json | null
          company_id?: string
          country_code?: string | null
          created_at?: string
          currency?: string | null
          destination?: string
          duration_days?: number
          excludes?: Json | null
          highlights?: Json | null
          id?: string
          images?: Json | null
          includes?: Json | null
          is_available?: boolean | null
          itinerary?: Json | null
          max_travelers?: number | null
          metadata?: Json | null
          min_travelers?: number | null
          price_per_person?: number
          title?: string
          trip_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "trip_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      usage_snapshots: {
        Row: {
          company_id: string
          created_at: string
          id: string
          metrics: Json
          snapshot_date: string
          snapshot_type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          metrics?: Json
          snapshot_date: string
          snapshot_type?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          metrics?: Json
          snapshot_date?: string
          snapshot_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "usage_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string
          email: string
          full_name: string | null
          has_medical_access: boolean
          id: string
          is_active: boolean
          last_seen_at: string | null
          metadata: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id: string
          created_at?: string
          email: string
          full_name?: string | null
          has_medical_access?: boolean
          id: string
          is_active?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          has_medical_access?: boolean
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
    }
    Views: {
      v_admin_company_overview: {
        Row: {
          activated_at: string | null
          active_chatbots: number | null
          active_users: number | null
          chatbot_sessions_30d: number | null
          country: string | null
          created_at: string | null
          events_last_30d: number | null
          id: string | null
          last_activity_at: string | null
          name: string | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          status: Database["public"]["Enums"]["company_status"] | null
          total_clients: number | null
        }
        Insert: {
          activated_at?: string | null
          active_chatbots?: never
          active_users?: never
          chatbot_sessions_30d?: never
          country?: string | null
          created_at?: string | null
          events_last_30d?: never
          id?: string | null
          last_activity_at?: never
          name?: string | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          status?: Database["public"]["Enums"]["company_status"] | null
          total_clients?: never
        }
        Update: {
          activated_at?: string | null
          active_chatbots?: never
          active_users?: never
          chatbot_sessions_30d?: never
          country?: string | null
          created_at?: string | null
          events_last_30d?: never
          id?: string | null
          last_activity_at?: never
          name?: string | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          sector?: Database["public"]["Enums"]["sector_type"] | null
          status?: Database["public"]["Enums"]["company_status"] | null
          total_clients?: never
        }
        Relationships: []
      }
      v_admin_leads_pipeline: {
        Row: {
          assigned_to_name: string | null
          business_name: string | null
          company_id: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          followup_count: number | null
          id: string | null
          last_followup_at: string | null
          phone: string | null
          score: number | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          source: Database["public"]["Enums"]["lead_source"] | null
          status: Database["public"]["Enums"]["lead_status"] | null
        }
        Relationships: []
      }
      v_chatbot_whatsapp: {
        Row: {
          chatbot_id: string | null
          chatbot_name: string | null
          company_id: string | null
          company_name: string | null
          escalation_phone: string | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          sector_template:
            | Database["public"]["Enums"]["chatbot_template"]
            | null
          settings: Json | null
          welcome_message: string | null
          whatsapp_business_id: string | null
          whatsapp_phone_number_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "chatbots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      v_clinic_today: {
        Row: {
          appointment_date: string | null
          appointment_id: string | null
          appointment_time: string | null
          chief_complaint: string | null
          company_id: string | null
          doctor_name: string | null
          duration_min: number | null
          patient_name: string | null
          patient_phone: string | null
          specialty: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          urgency_level: Database["public"]["Enums"]["urgency_level"] | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      v_insight_summary: {
        Row: {
          automation_score: number | null
          company_id: string | null
          company_name: string | null
          critical_alerts: number | null
          engagement_score: number | null
          open_alerts: number | null
          overall_score: number | null
          pending_recommendations: number | null
          score_date: string | null
          score_delta: number | null
          sector: Database["public"]["Enums"]["sector_type"] | null
          status: Database["public"]["Enums"]["company_status"] | null
          unreviewed_messages: number | null
        }
        Relationships: []
      }
      v_real_estate_pipeline: {
        Row: {
          avg_score: number | null
          company_id: string | null
          latest_update_at: string | null
          lead_count: number | null
          oldest_lead_at: string | null
          pipeline_stage:
            | Database["public"]["Enums"]["property_lead_stage"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "property_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      v_restaurant_dashboard: {
        Row: {
          avg_order_value: number | null
          cancelled_orders: number | null
          chatbot_orders: number | null
          company_id: string | null
          order_date: string | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
      v_school_class_summary: {
        Row: {
          academic_year: string | null
          avg_grade_pct: number | null
          class_id: string | null
          class_name: string | null
          company_id: string | null
          level: string | null
          student_count: number | null
          unjustified_absences: number | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_admin_leads_pipeline"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "v_insight_summary"
            referencedColumns: ["company_id"]
          },
        ]
      }
    }
    Functions: {
      activate_company: {
        Args: { p_admin_id: string; p_company_id: string; p_notes?: string }
        Returns: undefined
      }
      can_access_medical_data: { Args: never; Returns: boolean }
      deactivate_company: {
        Args: {
          p_admin_id: string
          p_company_id: string
          p_new_status?: Database["public"]["Enums"]["company_status"]
          p_reason?: string
        }
        Returns: undefined
      }
      generate_order_number: { Args: { p_company_id: string }; Returns: string }
      get_chatbox_ai_context: {
        Args: { p_client_phone: string; p_phone_number_id: string }
        Returns: Json
      }
      get_company_daily_stats: { Args: { p_company_id: string }; Returns: Json }
      get_company_whatsapp_config: {
        Args: { p_phone_number_id: string }
        Returns: Json
      }
      get_current_company_id: { Args: never; Returns: string }
      get_current_user_medical_access: { Args: never; Returns: boolean }
      get_current_user_role: { Args: never; Returns: string }
      handle_chatbot_crm_write: {
        Args: {
          p_chatbot_id: string
          p_client: Json
          p_company_id: string
          p_event_type: string
          p_payload: Json
          p_sector: Database["public"]["Enums"]["sector_type"]
          p_session_id: string
        }
        Returns: Json
      }
      handle_chatbot_crm_write_flat: {
        Args: {
          p_appt_date?: string
          p_appt_time?: string
          p_booking_ref?: string
          p_budget_max?: number
          p_budget_min?: number
          p_chatbot_id: string
          p_chief_complaint?: string
          p_class_level?: string
          p_client_email?: string
          p_client_name: string
          p_client_phone: string
          p_company_id: string
          p_currency?: string
          p_departure_date?: string
          p_doctor_id?: string
          p_enrollment_year?: string
          p_event_type: string
          p_items?: string
          p_lead_type?: string
          p_notes?: string
          p_preferred_zones?: string
          p_score?: number
          p_sector: string
          p_session_id: string
          p_specialty?: string
          p_student_first?: string
          p_student_last?: string
          p_table_ref?: string
          p_timeline?: string
          p_total_amount?: number
          p_traveler_count?: number
          p_urgency_level?: string
        }
        Returns: Json
      }
      is_admin_user: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      link_demo_restaurant_user: {
        Args: { p_full_name: string }
        Returns: string
      }
      log_event: {
        Args: {
          p_channel?: string
          p_company_id: string
          p_data?: Json
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: string
        }
        Returns: string
      }
      register_company: {
        Args: {
          p_city: string
          p_company_name: string
          p_country: string
          p_email: string
          p_full_name: string
          p_sector: Database["public"]["Enums"]["sector_type"]
          p_user_id: string
        }
        Returns: Json
      }
      save_chatbox_turn: {
        Args: {
          p_ai_response: string
          p_ai_result: Json
          p_chatbot_id: string
          p_client_phone: string
          p_company_id: string
          p_session_id: string
          p_user_message: string
        }
        Returns: Json
      }
    }
    Enums: {
      academic_term:
        | "term_1"
        | "term_2"
        | "term_3"
        | "semester_1"
        | "semester_2"
        | "annual"
      admin_role: "super_admin" | "sales" | "support" | "analyst"
      ai_action_status: "pending" | "success" | "failed" | "skipped"
      alert_severity: "info" | "warning" | "critical"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
      booking_status:
        | "draft"
        | "confirmed"
        | "deposit_paid"
        | "fully_paid"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "refunded"
      chatbot_channel: "whatsapp" | "web_widget" | "both"
      chatbot_template:
        | "restaurant_order"
        | "restaurant_reservation"
        | "real_estate_qualification"
        | "travel_package_advisor"
        | "school_enrollment"
        | "clinic_triage"
        | "custom"
      company_status: "pending" | "active" | "inactive" | "suspended"
      lead_source:
        | "website_form"
        | "whatsapp_inbound"
        | "referral"
        | "social_media"
        | "event"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "demo_scheduled"
        | "converted"
        | "lost"
      lead_type: "buyer" | "renter" | "investor" | "seller"
      onboarding_status:
        | "not_started"
        | "profile_complete"
        | "chatbot_configured"
        | "team_invited"
        | "completed"
      order_channel: "chatbot" | "staff" | "web" | "phone"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "closed"
        | "cancelled"
      payment_status: "pending" | "paid" | "partial" | "refunded" | "failed"
      property_lead_stage:
        | "new"
        | "qualified"
        | "visit_scheduled"
        | "visit_done"
        | "offer_sent"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
      property_status:
        | "available"
        | "reserved"
        | "sold"
        | "rented"
        | "off_market"
      property_type:
        | "apartment"
        | "house"
        | "villa"
        | "land"
        | "office"
        | "commercial"
        | "warehouse"
      sector_type:
        | "restaurant"
        | "real_estate"
        | "travel_agency"
        | "private_school"
        | "private_clinic"
      student_status:
        | "prospect"
        | "enrolled"
        | "active"
        | "graduated"
        | "transferred"
        | "withdrawn"
      urgency_level: "low" | "medium" | "high" | "emergency"
      user_role: "owner" | "admin" | "member"
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
      academic_term: [
        "term_1",
        "term_2",
        "term_3",
        "semester_1",
        "semester_2",
        "annual",
      ],
      admin_role: ["super_admin", "sales", "support", "analyst"],
      ai_action_status: ["pending", "success", "failed", "skipped"],
      alert_severity: ["info", "warning", "critical"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
      ],
      booking_status: [
        "draft",
        "confirmed",
        "deposit_paid",
        "fully_paid",
        "in_progress",
        "completed",
        "cancelled",
        "refunded",
      ],
      chatbot_channel: ["whatsapp", "web_widget", "both"],
      chatbot_template: [
        "restaurant_order",
        "restaurant_reservation",
        "real_estate_qualification",
        "travel_package_advisor",
        "school_enrollment",
        "clinic_triage",
        "custom",
      ],
      company_status: ["pending", "active", "inactive", "suspended"],
      lead_source: [
        "website_form",
        "whatsapp_inbound",
        "referral",
        "social_media",
        "event",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "demo_scheduled",
        "converted",
        "lost",
      ],
      lead_type: ["buyer", "renter", "investor", "seller"],
      onboarding_status: [
        "not_started",
        "profile_complete",
        "chatbot_configured",
        "team_invited",
        "completed",
      ],
      order_channel: ["chatbot", "staff", "web", "phone"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "closed",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "partial", "refunded", "failed"],
      property_lead_stage: [
        "new",
        "qualified",
        "visit_scheduled",
        "visit_done",
        "offer_sent",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
      property_status: [
        "available",
        "reserved",
        "sold",
        "rented",
        "off_market",
      ],
      property_type: [
        "apartment",
        "house",
        "villa",
        "land",
        "office",
        "commercial",
        "warehouse",
      ],
      sector_type: [
        "restaurant",
        "real_estate",
        "travel_agency",
        "private_school",
        "private_clinic",
      ],
      student_status: [
        "prospect",
        "enrolled",
        "active",
        "graduated",
        "transferred",
        "withdrawn",
      ],
      urgency_level: ["low", "medium", "high", "emergency"],
      user_role: ["owner", "admin", "member"],
    },
  },
} as const
