const { createClient } = require('@supabase/supabase-js');

async function setupAuthWithAutoConfirm() {
  // Using the provided credentials directly
  const supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Setting up authentication with auto-confirmation...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Generate a test user with a realistic email
    const timestamp = Math.floor(Date.now() / 1000);
    const testEmail = `testuser.${timestamp}@gmail.com`;
    const testPassword = 'Password123!';
    
    console.log(`\nFor your Supabase dashboard:`);
    console.log(`1. Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/users`);
    console.log(`2. Look for users with emails like "testuser.*@gmail.com"`);
    console.log(`3. You can confirm users manually or enable auto-confirmation in Settings\n`);
    
    console.log(`Attempting to create a test user (${testEmail})...`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          phone: '+35799123456'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error during signup:', signUpError);
      return;
    } 
    
    console.log('Signup successful!');
    console.log('User data:', {
      id: signUpData.user.id,
      email: signUpData.user.email,
      created_at: signUpData.user.created_at,
    });
    
    console.log('\nNext Steps:');
    console.log('1. To enable auto-confirmation for testing:');
    console.log('   - Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/settings');
    console.log('   - Under "Email Auth", enable "Confirm email" and choose "Auto-confirm" temporarily');
    console.log('   - Save changes');
    
    console.log('\n2. To create storage buckets:');
    console.log('   - Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/storage/buckets');
    console.log('   - Create buckets named: "ad-images", "user-avatars", and "category-icons"');
    console.log('   - Make them all public');
    
    console.log('\n3. To set up RLS policies:');
    console.log('   - Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/policies');
    console.log('   - Create policies for "ads" table allowing authenticated users to insert their own ads');
    console.log('   - Create policies for the storage buckets to allow uploads by authenticated users');
    
    console.log('\n4. After enabling auto-confirmation, run "node create-test-ad.js" to create a test ad');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

setupAuthWithAutoConfirm(); 