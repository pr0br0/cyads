const { createClient } = require('@supabase/supabase-js');

async function createTestAd() {
  // Using the provided credentials directly
  const supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Creating a test ad with an auto-confirmed user...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Create a test user with auto-confirmation enabled
    const timestamp = Math.floor(Date.now() / 1000);
    const testEmail = `testuser.${timestamp}@gmail.com`;
    const testPassword = 'Password123!';
    
    console.log(`Creating a test user (${testEmail})...`);
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
    console.log('User ID:', signUpData.user.id);
    
    // Sign in with the new user immediately (this should work if auto-confirmation is enabled)
    console.log('\nAttempting to sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('Error during sign in:', signInError);
      console.error('\nAuto-confirmation may not be enabled. Please follow these steps:');
      console.error('1. Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/settings');
      console.error('2. Under "Email Auth", enable "Confirm email" and select "Auto-confirm"');
      console.error('3. Save your changes and run this script again');
      return;
    }
    
    console.log('Sign in successful!');
    
    // Get category and location data for our test ad
    console.log('\nFetching categories and locations...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', 'property')
      .limit(1);
      
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('id, slug')
      .eq('slug', 'limassol')
      .limit(1);
      
    if (locationsError) {
      console.error('Error fetching locations:', locationsError);
      return;
    }
    
    if (!categories.length || !locations.length) {
      console.error('Could not find required category or location data');
      return;
    }
    
    // Create a test ad
    console.log('\nCreating test ad...');
    const testAd = {
      title: 'Luxury Villa with Sea View',
      description: 'Spacious 4-bedroom villa with private pool and stunning sea views. Located in a quiet area just 10 minutes from the city center.',
      price: 2500,
      currency: 'EUR',
      category_id: categories[0].id,
      location_id: locations[0].id,
      status: 'published',
      is_featured: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
    
    const { data: adData, error: adError } = await supabase
      .from('ads')
      .insert([testAd])
      .select();
      
    if (adError) {
      console.error('Error creating ad:', adError);
      console.error('\nYou may need to set up RLS policies:');
      console.error('1. Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/policies');
      console.error('2. Create a policy for the ads table that allows authenticated users to insert records');
      return;
    }
    
    console.log('Successfully created test ad!');
    console.log('Ad ID:', adData[0].id);
    console.log('Ad Title:', adData[0].title);
    
    // Create a second ad to have some variety
    console.log('\nCreating a second test ad...');
    const secondTestAd = {
      title: 'New Model Smartphone - Great Price',
      description: 'Latest model smartphone with 256GB storage, barely used and in perfect condition. Comes with all original accessories and box.',
      price: 650,
      currency: 'EUR',
      category_id: categories.find(c => c.slug === 'electronics')?.id || categories[0].id,
      location_id: locations.find(l => l.slug === 'nicosia')?.id || locations[0].id,
      status: 'published',
      is_featured: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
    
    const { data: secondAdData, error: secondAdError } = await supabase
      .from('ads')
      .insert([secondTestAd])
      .select();
      
    if (secondAdError) {
      console.error('Error creating second ad:', secondAdError);
    } else {
      console.log('Successfully created second test ad!');
      console.log('Ad ID:', secondAdData[0].id);
      console.log('Ad Title:', secondAdData[0].title);
    }
    
    console.log('\nVerifying ads in database...');
    const { data: allAds, error: fetchError } = await supabase
      .from('ads')
      .select('id, title, price, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (fetchError) {
      console.error('Error fetching ads:', fetchError);
    } else {
      console.log('Most recent ads in database:');
      allAds.forEach(ad => {
        console.log(`- ${ad.title} (ID: ${ad.id}, Price: ${ad.price || 'Not specified'})`);
      });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestAd(); 