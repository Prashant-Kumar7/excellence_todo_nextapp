-- Script to list all admin users
-- Run this in Supabase SQL Editor

SELECT 
  id,
  email,
  full_name,
  is_admin,
  is_blocked,
  created_at,
  updated_at
FROM user_profiles
WHERE is_admin = TRUE
ORDER BY created_at ASC;

-- To see all users (including non-admins):
-- SELECT id, email, full_name, is_admin, is_blocked
-- FROM user_profiles
-- ORDER BY is_admin DESC, created_at ASC;

