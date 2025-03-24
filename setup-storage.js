const { createClient } = require('@supabase/supabase-js');

async function setupStorage() {
  // Using the provided credentials directly
  const supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Setting up storage buckets...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check existing buckets first
    const { data: existingBuckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log(`Found ${existingBuckets.length} existing buckets`);
    const existingBucketNames = existingBuckets.map(b => b.name);
    
    // Define buckets needed for the application
    const requiredBuckets = [
      {
        name: 'ad-images', 
        public: true, 
        description: 'Bucket for classified ad images'
      },
      {
        name: 'user-avatars', 
        public: true, 
        description: 'Bucket for user profile avatars'
      },
      {
        name: 'category-icons', 
        public: true, 
        description: 'Bucket for category icon images'
      }
    ];
    
    // Create buckets that don't exist yet
    for (const bucket of requiredBuckets) {
      if (existingBucketNames.includes(bucket.name)) {
        console.log(`Bucket "${bucket.name}" already exists, skipping creation`);
        continue;
      }
      
      console.log(`Creating bucket "${bucket.name}"...`);
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
      });
      
      if (error) {
        console.error(`Error creating bucket "${bucket.name}":`, error);
      } else {
        console.log(`Successfully created bucket "${bucket.name}"`);
      }
    }
    
    // List all buckets to confirm
    const { data: updatedBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing updated buckets:', listError);
    } else {
      console.log('\nStorage buckets available:');
      updatedBuckets.forEach(bucket => {
        console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

setupStorage(); 