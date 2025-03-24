const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function checkSupabase() {
  // Log environment variables (masked for security)
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_KEY (first 10 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...');
  
  // Create Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not found in environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check connection
    console.log('\n--- Testing Connection ---');
    const { data: connectionTest, error: connectionError } = await supabase.from('_prisma_migrations').select('*').limit(1);
    if (connectionError) {
      console.error('Connection error:', connectionError);
    } else {
      console.log('Connection successful!');
    }
    
    // List tables
    console.log('\n--- Available Tables ---');
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
    } else {
      tables.forEach(table => {
        console.log(`- ${table.name}`);
      });
    }
    
    // Check some specific tables
    const tablesToCheck = ['users', 'categories', 'locations', 'ads', 'ad_images'];
    console.log('\n--- Table Contents (Sample) ---');
    
    for (const table of tablesToCheck) {
      console.log(`\nTable: ${table}`);
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(3);
        
      if (error) {
        console.error(`  Error fetching ${table}:`, error);
      } else {
        console.log(`  Total rows: ${count}`);
        console.log(`  Sample data:`, data.length ? data : 'No data found');
      }
    }
    
    // Storage buckets
    console.log('\n--- Storage Buckets ---');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
    } else {
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name}`);
      });
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkSupabase(); 