-- Add RLS policy to allow admins to view all todos
-- Run this in Supabase SQL Editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can view all todos" ON todos;

-- Create policy for admins to view all todos
CREATE POLICY "Admins can view all todos"
  ON todos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

