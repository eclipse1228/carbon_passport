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
      passports: {
        Row: {
          id: string
          traveler_name: string
          country: 'KR' | 'US' | 'JP' | 'CN' | null
          photo_url: string | null
          travel_date: string
          share_hash: string | null
          expires_at: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          traveler_name: string
          country?: 'KR' | 'US' | 'JP' | 'CN' | null
          photo_url?: string | null
          travel_date?: string
          share_hash?: string | null
          expires_at?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          traveler_name?: string
          country?: 'KR' | 'US' | 'JP' | 'CN' | null
          photo_url?: string | null
          travel_date?: string
          share_hash?: string | null
          expires_at?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      routes: {
        Row: {
          id: string
          passport_id: string
          start_station: string
          end_station: string
          distance: number
          co2_train: number
          co2_car: number
          co2_bus: number
          co2_airplane: number
          co2_saved: number
          sequence_order: number
          created_at: string
        }
        Insert: {
          id?: string
          passport_id: string
          start_station: string
          end_station: string
          distance: number
          co2_train: number
          co2_car: number
          co2_bus: number
          co2_airplane: number
          co2_saved: number
          sequence_order: number
          created_at?: string
        }
        Update: {
          id?: string
          passport_id?: string
          start_station?: string
          end_station?: string
          distance?: number
          co2_train?: number
          co2_car?: number
          co2_bus?: number
          co2_airplane?: number
          co2_saved?: number
          sequence_order?: number
          created_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: string
          passport_id: string
          responses: Json
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          passport_id: string
          responses?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          passport_id?: string
          responses?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      stations: {
        Row: {
          code: string
          name_ko: string
          name_en: string
          name_ja: string | null
          name_zh: string | null
          latitude: number
          longitude: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          code: string
          name_ko: string
          name_en: string
          name_ja?: string | null
          name_zh?: string | null
          latitude: number
          longitude: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          name_ko?: string
          name_en?: string
          name_ja?: string | null
          name_zh?: string | null
          latitude?: number
          longitude?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_share_hash: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}