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

-- Create a stored procedure to confirm a user
CREATE OR REPLACE FUNCTION auth.confirm_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW(),
      confirmed_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Enable access to this function for authenticated users
GRANT EXECUTE ON FUNCTION auth.confirm_user TO authenticated;
GRANT EXECUTE ON FUNCTION auth.confirm_user TO anon; 