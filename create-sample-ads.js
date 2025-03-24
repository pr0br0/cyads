const { createClient } = require('@supabase/supabase-js');

async function createSampleAds() {
  // Using the provided credentials directly
  const supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Creating sample ads...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First, get category and location IDs
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('id, slug');
    
    if (locationsError) {
      console.error('Error fetching locations:', locationsError);
      return;
    }
    
    console.log('Found categories:', categories.map(c => c.slug).join(', '));
    console.log('Found locations:', locations.map(l => l.slug).join(', '));
    
    // Create a test user first if we don't have one
    let userId = null;
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else if (users.length === 0) {
      // Create a test user
      console.log('Creating a test user...');
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            phone: '+35799123456'
          }
        ])
        .select();
      
      if (createUserError) {
        console.error('Error creating test user:', createUserError);
      } else {
        userId = newUser[0].id;
        console.log('Created test user with ID:', userId);
      }
    } else {
      userId = users[0].id;
      console.log('Using existing user with ID:', userId);
    }
    
    if (!userId) {
      console.error('No user ID available, cannot create ads');
      return;
    }
    
    // Create sample ads
    const sampleAds = [
      {
        title: 'Luxury Apartment for Rent in Limassol',
        description: 'Beautiful 2-bedroom apartment with sea view in the heart of Limassol. Fully furnished with modern appliances.',
        price: 1200,
        currency: 'EUR',
        category_id: categories.find(c => c.slug === 'property')?.id,
        location_id: locations.find(l => l.slug === 'limassol')?.id,
        user_id: userId,
        status: 'published',
        is_featured: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      },
      {
        title: '2020 Mercedes-Benz C-Class',
        description: 'Well-maintained Mercedes-Benz C-Class with low mileage. Includes premium package and all service records.',
        price: 25000,
        currency: 'EUR',
        category_id: categories.find(c => c.slug === 'vehicles')?.id,
        location_id: locations.find(l => l.slug === 'nicosia')?.id,
        user_id: userId,
        status: 'published',
        is_featured: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      },
      {
        title: 'Software Developer - Remote Position',
        description: 'Looking for an experienced software developer to join our team. Remote position with competitive salary.',
        price: null,
        currency: 'EUR',
        category_id: categories.find(c => c.slug === 'jobs')?.id,
        location_id: locations.find(l => l.slug === 'larnaca')?.id,
        user_id: userId,
        status: 'published',
        is_featured: false,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }
    ];
    
    // Insert ads
    console.log('Creating sample ads...');
    const { data: createdAds, error: createAdsError } = await supabase
      .from('ads')
      .insert(sampleAds)
      .select();
    
    if (createAdsError) {
      console.error('Error creating sample ads:', createAdsError);
    } else {
      console.log(`Successfully created ${createdAds.length} sample ads:`);
      createdAds.forEach(ad => {
        console.log(`- ${ad.title} (ID: ${ad.id})`);
      });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createSampleAds(); 