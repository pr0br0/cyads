const { createClient } = require('@supabase/supabase-js');

async function setupAuth() {
  // Using the provided credentials directly
  const supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Setting up authentication...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Check if auth is properly configured
    console.log('Checking authentication configuration...');
    
    // Try to sign up a test user with a more realistic email
    const timestamp = Math.floor(Date.now() / 1000);
    const testEmail = `testuser.${timestamp}@gmail.com`;
    const testPassword = 'Password123!';
    
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
    } else {
      console.log('Signup successful!');
      console.log('User data:', {
        id: signUpData.user.id,
        email: signUpData.user.email,
        created_at: signUpData.user.created_at,
      });
      
      // Now let's try to login
      console.log('\nAttempting to login with the new user...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (signInError) {
        console.error('Error during login:', signInError);
      } else {
        console.log('Login successful!');
        console.log('Session established with token:', signInData.session.access_token.substring(0, 10) + '...');
        
        // Try to create an ad as the authenticated user
        console.log('\nAttempting to create a test ad as the authenticated user...');
        
        // First, get a category and location
        const { data: categories } = await supabase
          .from('categories')
          .select('id, slug')
          .eq('slug', 'property')
          .limit(1);
          
        const { data: locations } = await supabase
          .from('locations')
          .select('id, slug')
          .eq('slug', 'limassol')
          .limit(1);
          
        if (categories?.length > 0 && locations?.length > 0) {
          const categoryId = categories[0].id;
          const locationId = locations[0].id;
          
          const testAd = {
            title: 'Test Ad - Created via Auth',
            description: 'This is a test ad created by an authenticated user.',
            price: 100,
            currency: 'EUR',
            category_id: categoryId,
            location_id: locationId,
            user_id: signUpData.user.id,
            status: 'published',
            is_featured: false,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          };
          
          const { data: adData, error: adError } = await supabase
            .from('ads')
            .insert([testAd])
            .select();
            
          if (adError) {
            console.error('Error creating test ad:', adError);
          } else {
            console.log('Successfully created test ad!');
            console.log('Ad data:', adData[0]);
          }
        } else {
          console.error('Could not find category or location');
        }
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

setupAuth(); 