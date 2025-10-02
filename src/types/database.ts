export interface Database {
  public: {
    Tables: {
      wishlist_submissions: {
        Row: {
          id: string
          created_at: string
          user_name: string
          must_have_items: string
          nice_to_have_items: string
          preposterous_wishes: string
          snack_preferences: string
          additional_comments: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_name: string
          must_have_items: string
          nice_to_have_items: string
          preposterous_wishes: string
          snack_preferences: string
          additional_comments: string
        }
        Update: {
          id?: string
          created_at?: string
          user_name?: string
          must_have_items?: string
          nice_to_have_items?: string
          preposterous_wishes?: string
          snack_preferences?: string[]
          additional_comments?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string
          license_type: string
          license_number: string
          years_experience: number
          specialties: string[]
          rate_min: number
          rate_max: number
          weekly_hours_min?: number
          weekly_hours_max?: number
          distance: number
          constraints: string[]
          availability: {
            monday: string[]
            tuesday: string[]
            wednesday: string[]
            thursday: string[]
            friday: string[]
            saturday: string[]
            sunday: string[]
          }
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone: string
          license_type: string
          license_number: string
          years_experience: number
          specialties: string[]
          rate_min: number
          rate_max: number
          weekly_hours_min?: number
          weekly_hours_max?: number
          distance: number
          constraints: string[]
          availability: {
            monday: string[]
            tuesday: string[]
            wednesday: string[]
            thursday: string[]
            friday: string[]
            saturday: string[]
            sunday: string[]
          }
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string
          license_type?: string
          license_number?: string
          years_experience?: number
          specialties?: string[]
          rate_min?: number
          rate_max?: number
          weekly_hours_min?: number
          weekly_hours_max?: number
          distance?: number
          constraints?: string[]
          availability?: {
            monday: string[]
            tuesday: string[]
            wednesday: string[]
            thursday: string[]
            friday: string[]
            saturday: string[]
            sunday: string[]
          }
        }
      }
      agent_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          session_id: string
          agent_type: string
          conversation_state: any
          agent_state: any
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          session_id: string
          agent_type: string
          conversation_state: any
          agent_state: any
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          session_id?: string
          agent_type?: string
          conversation_state?: any
          agent_state?: any
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
        }
      }
    }
  }
}
