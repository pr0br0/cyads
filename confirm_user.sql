-- SQL script to manually confirm a user
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/sql)

-- Update the email address to the one you want to confirm
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now(),
    is_confirmed = true
WHERE email LIKE 'testuser.%@gmail.com';

-- Verify the update
SELECT id, email, email_confirmed_at, confirmed_at, is_confirmed
FROM auth.users
WHERE email LIKE 'testuser.%@gmail.com'; 