const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkWithAnonKey() {
  // Look for .env.local in current directory and cyads-app subdirectory
  const fs = require('fs');
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Try to read from .env.local if not found via dotenv
  if (!supabaseUrl || !supabaseKey) {
    try {
      // Try in current directory
      if (fs.existsSync('./.env.local')) {
        const envFile = fs.readFileSync('./.env.local', 'utf8');
        const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
        const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
        
        if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1];
        if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1];
      } 
      // Try in cyads-app subdirectory
      else if (fs.existsSync('./cyads-app/.env.local')) {
        const envFile = fs.readFileSync('./cyads-app/.env.local', 'utf8');
        const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
        const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
        
        if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1];
        if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1];
      }
    } catch (error) {
      console.error('Error reading .env.local file:', error);
    }
  }
  
  // Fallback to hardcoded URL if all else fails
  if (!supabaseUrl) {
    supabaseUrl = 'https://zvyuurbieuionummrcqi.supabase.co';
  }
  
  if (!supabaseKey) {
    console.error('Could not find Supabase anon key in environment variables or .env.local');
    return;
  }
  
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('Using anon key from .env.local');
  
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

checkWithAnonKey(); 