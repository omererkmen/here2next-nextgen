-- Onboarding Migration: Add status column to startups and corporates
-- Run this in Supabase SQL Editor

-- Add status to startups (existing records get 'approved')
ALTER TABLE startups ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
CREATE INDEX IF NOT EXISTS idx_startups_status ON startups(status);

-- Add status to corporates (existing records get 'approved')
ALTER TABLE corporates ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
CREATE INDEX IF NOT EXISTS idx_corporates_status ON corporates(status);

-- Update RLS: public can only see approved startups/corporates
-- First drop existing select policies if any, then recreate
DROP POLICY IF EXISTS "Anyone can view startups" ON startups;
CREATE POLICY "Anyone can view approved startups"
  ON startups FOR SELECT
  USING (status = 'approved' OR profile_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view corporates" ON corporates;
CREATE POLICY "Anyone can view approved corporates"
  ON corporates FOR SELECT
  USING (status = 'approved' OR profile_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Allow authenticated users to insert their own startup/corporate
DROP POLICY IF EXISTS "Users can insert own startup" ON startups;
CREATE POLICY "Users can insert own startup"
  ON startups FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert own corporate" ON corporates;
CREATE POLICY "Users can insert own corporate"
  ON corporates FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Allow admins to update status
DROP POLICY IF EXISTS "Admins can update startups" ON startups;
CREATE POLICY "Admins can update startups"
  ON startups FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update corporates" ON corporates;
CREATE POLICY "Admins can update corporates"
  ON corporates FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
