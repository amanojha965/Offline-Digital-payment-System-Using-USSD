/*
  # Offline Digital Payment System Using USSD - Database Schema

  ## Overview
  This migration creates the complete database schema for an offline digital payment system
  that operates through USSD technology, enabling mobile payments without internet connectivity.

  ## New Tables

  ### 1. profiles
  User profile information linked to authentication
  - `id` (uuid, primary key) - References auth.users
  - `phone_number` (text, unique) - User's phone number for USSD
  - `full_name` (text) - User's full name
  - `pin_hash` (text) - Hashed PIN for transaction authorization
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. wallets
  User wallet balances and information
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `balance` (decimal) - Current wallet balance
  - `currency` (text) - Currency code (e.g., USD, KES)
  - `is_locked` (boolean) - Lock status for security
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. merchants
  Merchant account information
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `business_name` (text)
  - `merchant_code` (text, unique) - Unique merchant identifier
  - `category` (text) - Business category
  - `is_verified` (boolean) - Verification status
  - `created_at` (timestamptz)

  ### 4. transactions
  All payment transaction records
  - `id` (uuid, primary key)
  - `sender_id` (uuid) - References profiles
  - `receiver_id` (uuid) - References profiles
  - `amount` (decimal) - Transaction amount
  - `currency` (text) - Currency code
  - `transaction_type` (text) - Type: send, receive, withdraw, deposit
  - `status` (text) - Status: pending, completed, failed, reversed
  - `reference_number` (text, unique) - Transaction reference
  - `description` (text) - Transaction description
  - `metadata` (jsonb) - Additional transaction data
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 5. ussd_sessions
  Active USSD session tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `session_id` (text, unique) - USSD session identifier
  - `phone_number` (text) - User's phone number
  - `current_step` (text) - Current menu step
  - `session_data` (jsonb) - Session state data
  - `is_active` (boolean) - Session active status
  - `expires_at` (timestamptz) - Session expiration time
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Authenticated access required for all operations
  - Merchants can view their transaction history
  - Admin policies can be added for system management

  ## Indexes
  - Phone number lookups optimized
  - Transaction queries by user optimized
  - Session lookups by session_id optimized
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  pin_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  balance decimal(15, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
  currency text DEFAULT 'USD' NOT NULL,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- Create merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text NOT NULL,
  merchant_code text UNIQUE NOT NULL,
  category text NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount decimal(15, 2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'USD' NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('send', 'receive', 'withdraw', 'deposit', 'merchant_payment')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  reference_number text UNIQUE NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create ussd_sessions table
CREATE TABLE IF NOT EXISTS ussd_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  current_step text DEFAULT 'main_menu',
  session_data jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  expires_at timestamptz DEFAULT (now() + interval '10 minutes'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_code ON merchants(merchant_code);
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_number);
CREATE INDEX IF NOT EXISTS idx_ussd_sessions_session_id ON ussd_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ussd_sessions_phone ON ussd_sessions(phone_number);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ussd_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create own wallet"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Merchants policies
CREATE POLICY "Anyone can view verified merchants"
  ON merchants FOR SELECT
  TO authenticated
  USING (is_verified = true OR user_id = auth.uid());

CREATE POLICY "Users can create own merchant account"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own merchant account"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create transactions as sender"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- USSD sessions policies
CREATE POLICY "Users can view own sessions"
  ON ussd_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions"
  ON ussd_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON ussd_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON ussd_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ussd_sessions_updated_at
  BEFORE UPDATE ON ussd_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
