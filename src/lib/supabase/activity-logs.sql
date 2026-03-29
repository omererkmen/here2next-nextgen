-- Activity Logs Table for Here2Next Admin
-- Run this in Supabase SQL Editor

CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- RLS: Only admins can read logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Anyone can insert logs (for tracking anonymous actions like failed logins)
CREATE POLICY "Anyone can insert logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);
