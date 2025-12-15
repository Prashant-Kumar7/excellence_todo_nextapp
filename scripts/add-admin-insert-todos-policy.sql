-- Add RLS policy to allow admins to insert todos for any user
-- Run this in Supabase SQL Editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can insert todos for any user" ON todos;

-- Create policy for admins to insert todos for any user
CREATE POLICY "Admins can insert todos for any user"
  ON todos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

