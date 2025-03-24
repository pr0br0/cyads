const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function checkWithToken() {
  // Using the provided access token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvyuurbieuionummrcqi.supabase.co';
  const supabaseKey = 'sbp_257f1b68dca5e677ef374a7231d27628cb1ed60c';
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Using provided access token');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check connection using the users table
    console.log('\n--- Testing Connection ---');
    const { data: users, error: usersError } = await supabase.from('users').select('*').limit(5);
    
    if (usersError) {
      console.error('Error accessing users table:', usersError);
    } else {
      console.log('Connection to users table successful!');
      console.log(`Found ${users.length} users`);
      if (users.length > 0) {
        // Show limited user data for privacy
        console.log('Sample user data (limited fields):');
        users.forEach(user => {
          console.log({
            id: user.id,
            email: user.email ? `${user.email.substring(0, 3)}***@***` : 'No email',
            created_at: user.created_at
          });
        });
      }
    }

    // Check other important tables
    const tables = ['categories', 'locations', 'ads'];
    for (const table of tables) {
      console.log(`\n--- Checking ${table} table ---`);
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(3);
        
      if (error) {
        console.error(`Error accessing ${table} table:`, error);
      } else {
        console.log(`${table} table accessible - found ${data.length} records (showing max 3)`);
        if (data.length > 0) {
          console.log(data);
        }
      }
    }
    
    // Check storage buckets
    console.log('\n--- Storage Buckets ---');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
    } else {
      console.log(`Found ${buckets.length} storage buckets:`);
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name}`);
      });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkWithToken(); 