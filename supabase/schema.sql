-- Supabase Database Schema for Converso

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companions table
CREATE TABLE IF NOT EXISTS companions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  voice TEXT NOT NULL,
  style TEXT NOT NULL,
  duration INTEGER NOT NULL,
  bookmarked BOOLEAN DEFAULT FALSE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL,
  companion_id UUID REFERENCES companions(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companions_user_id ON companions(user_id);
CREATE INDEX IF NOT EXISTS idx_companions_created_at ON companions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_companion_id ON sessions(companion_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own companions" ON companions;
DROP POLICY IF EXISTS "Users can create their own companions" ON companions;
DROP POLICY IF EXISTS "Users can update their own companions" ON companions;
DROP POLICY IF EXISTS "Users can delete their own companions" ON companions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;

-- Companions policies (using authenticated user check)
CREATE POLICY "Users can view their own companions"
  ON companions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own companions"
  ON companions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own companions"
  ON companions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete their own companions"
  ON companions FOR DELETE
  TO authenticated
  USING (true);

-- Sessions policies (using authenticated user check)
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (true);
