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
          user_type: 'student' | 'teacher' | 'organization'
          avatar_url: string | null
          xp: number
          level: number
          streak_days: number
          last_active_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type?: 'student' | 'teacher' | 'organization'
          avatar_url?: string | null
          xp?: number
          level?: number
          streak_days?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          user_type?: 'student' | 'teacher' | 'organization'
          avatar_url?: string | null
          xp?: number
          level?: number
          streak_days?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          native_language: string
          target_languages: string[]
          learning_goals: string[]
          interests: string[]
          accessibility_needs: string[]
          preferred_difficulty: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          native_language?: string
          target_languages?: string[]
          learning_goals?: string[]
          interests?: string[]
          accessibility_needs?: string[]
          preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          native_language?: string
          target_languages?: string[]
          learning_goals?: string[]
          interests?: string[]
          accessibility_needs?: string[]
          preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          game_type: 'vocabulary' | 'culture' | 'soft-skills'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          score: number
          total_questions: number
          correct_answers: number
          time_spent: number
          xp_earned: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_type: 'vocabulary' | 'culture' | 'soft-skills'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          score: number
          total_questions: number
          correct_answers: number
          time_spent: number
          xp_earned?: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_type?: 'vocabulary' | 'culture' | 'soft-skills'
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          score?: number
          total_questions?: number
          correct_answers?: number
          time_spent?: number
          xp_earned?: number
          completed_at?: string
          created_at?: string
        }
      }
      ai_feedback: {
        Row: {
          id: string
          session_id: string
          user_id: string
          emotion_detected: string | null
          difficulty_suggestion: string | null
          mistake_patterns: string[]
          feedback_message: string
          encouragement: string | null
          next_steps: string[]
          confidence_score: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          emotion_detected?: string | null
          difficulty_suggestion?: string | null
          mistake_patterns?: string[]
          feedback_message: string
          encouragement?: string | null
          next_steps?: string[]
          confidence_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          emotion_detected?: string | null
          difficulty_suggestion?: string | null
          mistake_patterns?: string[]
          feedback_message?: string
          encouragement?: string | null
          next_steps?: string[]
          confidence_score?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          code: string
          title: string
          description: string
          icon: string
          category: string
          xp_reward: number
          requirement_type: string
          requirement_value: number
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description: string
          icon: string
          category: string
          xp_reward?: number
          requirement_type: string
          requirement_value: number
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string
          icon?: string
          category?: string
          xp_reward?: number
          requirement_type?: string
          requirement_value?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          title: string
          description: string
          category: 'courses' | 'mentoring' | 'resources' | 'certificates' | 'premium'
          xp_cost: number
          stock: number
          image_url: string | null
          external_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'courses' | 'mentoring' | 'resources' | 'certificates' | 'premium'
          xp_cost: number
          stock?: number
          image_url?: string | null
          external_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'courses' | 'mentoring' | 'resources' | 'certificates' | 'premium'
          xp_cost?: number
          stock?: number
          image_url?: string | null
          external_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          redeemed_at: string
          status: 'pending' | 'completed' | 'expired'
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          redeemed_at?: string
          status?: 'pending' | 'completed' | 'expired'
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          redeemed_at?: string
          status?: 'pending' | 'completed' | 'expired'
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          category: 'jobs' | 'courses' | 'help' | 'legal' | 'community'
          url: string
          icon: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'jobs' | 'courses' | 'help' | 'legal' | 'community'
          url: string
          icon?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'jobs' | 'courses' | 'help' | 'legal' | 'community'
          url?: string
          icon?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_tracker: {
        Row: {
          id: string
          user_id: string
          topic: string
          category: string
          mastery_level: number
          times_practiced: number
          last_practiced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic: string
          category: string
          mastery_level?: number
          times_practiced?: number
          last_practiced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic?: string
          category?: string
          mastery_level?: number
          times_practiced?: number
          last_practiced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
