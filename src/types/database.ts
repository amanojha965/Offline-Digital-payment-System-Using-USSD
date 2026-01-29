export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone_number: string;
          full_name: string;
          pin_hash: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone_number: string;
          full_name: string;
          pin_hash: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          full_name?: string;
          pin_hash?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          currency: string;
          is_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          currency?: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          currency?: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          sender_id: string | null;
          receiver_id: string | null;
          amount: number;
          currency: string;
          transaction_type: string;
          status: string;
          reference_number: string;
          description: string | null;
          metadata: Record<string, any>;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          receiver_id?: string | null;
          amount: number;
          currency?: string;
          transaction_type: string;
          status?: string;
          reference_number: string;
          description?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          receiver_id?: string | null;
          amount?: number;
          currency?: string;
          transaction_type?: string;
          status?: string;
          reference_number?: string;
          description?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      merchants: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          merchant_code: string;
          category: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          merchant_code: string;
          category: string;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          merchant_code?: string;
          category?: string;
          is_verified?: boolean;
          created_at?: string;
        };
      };
      ussd_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          phone_number: string;
          current_step: string;
          session_data: Record<string, any>;
          is_active: boolean;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          phone_number: string;
          current_step?: string;
          session_data?: Record<string, any>;
          is_active?: boolean;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string;
          phone_number?: string;
          current_step?: string;
          session_data?: Record<string, any>;
          is_active?: boolean;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
