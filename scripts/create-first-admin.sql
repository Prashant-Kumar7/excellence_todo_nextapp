-- Script to create the first admin user
-- Run this in Supabase SQL Editor after creating a user account
-- Replace 'USER_EMAIL_HERE' with the actual email of the user you want to make admin

-- Option 1: Make an existing user an admin (recommended)
-- First, sign up normally through the app, then run this:
UPDATE user_profiles
SET is_admin = TRUE
WHERE email = 'USER_EMAIL_HERE';

-- Option 2: Create admin directly (if you know the user ID from auth.users)
-- UPDATE user_profiles
-- SET is_admin = TRUE
-- WHERE id = 'USER_UUID_HERE';

-- Verify the admin was created
SELECT id, email, full_name, is_admin, is_blocked
FROM user_profiles
WHERE is_admin = TRUE;

