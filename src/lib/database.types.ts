export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          work_hours_start: string
          work_hours_end: string
          break_frequency: number
          calendar_connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          work_hours_start?: string
          work_hours_end?: string
          break_frequency?: number
          calendar_connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          work_hours_start?: string
          work_hours_end?: string
          break_frequency?: number
          calendar_connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      break_sessions: {
        Row: {
          id: string
          user_id: string
          scheduled_at: string
          completed_at: string | null
          skipped: boolean
          duration_seconds: number
          type: 'micro' | 'stretch' | 'rest'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheduled_at: string
          completed_at?: string | null
          skipped?: boolean
          duration_seconds?: number
          type: 'micro' | 'stretch' | 'rest'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scheduled_at?: string
          completed_at?: string | null
          skipped?: boolean
          duration_seconds?: number
          type?: 'micro' | 'stretch' | 'rest'
          created_at?: string
        }
      }
      stretch_routines: {
        Row: {
          id: string
          name: string
          description: string
          duration_seconds: number
          target_area: 'neck' | 'shoulders' | 'back' | 'wrists' | 'full_body'
          difficulty: 'easy' | 'medium' | 'hard'
          animation_url: string | null
          instructions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          duration_seconds: number
          target_area: 'neck' | 'shoulders' | 'back' | 'wrists' | 'full_body'
          difficulty: 'easy' | 'medium' | 'hard'
          animation_url?: string | null
          instructions: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          duration_seconds?: number
          target_area?: 'neck' | 'shoulders' | 'back' | 'wrists' | 'full_body'
          difficulty?: 'easy' | 'medium' | 'hard'
          animation_url?: string | null
          instructions?: string[]
          created_at?: string
        }
      }
      user_stretches: {
        Row: {
          id: string
          user_id: string
          stretch_id: string
          completed_at: string
          photo_url: string | null
          points_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stretch_id: string
          completed_at?: string
          photo_url?: string | null
          points_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stretch_id?: string
          completed_at?: string
          photo_url?: string | null
          points_earned?: number
          created_at?: string
        }
      }
      gamification: {
        Row: {
          id: string
          user_id: string
          total_points: number
          current_streak: number
          longest_streak: number
          level: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          current_streak?: number
          longest_streak?: number
          level?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          current_streak?: number
          longest_streak?: number
          level?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          requirement_type: string
          requirement_value: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          requirement_type: string
          requirement_value: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          requirement_type?: string
          requirement_value?: number
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
          created_at?: string
        }
      }
      virtual_pet: {
        Row: {
          id: string
          user_id: string
          name: string
          pet_type: string
          level: number
          experience: number
          happiness: number
          health: number
          last_fed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          pet_type?: string
          level?: number
          experience?: number
          happiness?: number
          health?: number
          last_fed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          pet_type?: string
          level?: number
          experience?: number
          happiness?: number
          health?: number
          last_fed?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          role: 'user' | 'assistant'
          sentiment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          role: 'user' | 'assistant'
          sentiment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          role?: 'user' | 'assistant'
          sentiment?: string | null
          created_at?: string
        }
      }
      stress_logs: {
        Row: {
          id: string
          user_id: string
          stress_level: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stress_level: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stress_level?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
