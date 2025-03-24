require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Setting up Vercel environment variables...');

try {
  // Check if Vercel CLI is installed locally
  console.log('Installing Vercel CLI locally...');
  execSync('npm install --no-save vercel', { stdio: 'inherit' });
  
  const vercelCmd = './node_modules/.bin/vercel';
  
  // Log in to Vercel if needed
  try {
    execSync(`${vercelCmd} whoami`, { stdio: 'pipe' });
    console.log('Already logged in to Vercel.');
  } catch (e) {
    console.log('Please log in to Vercel:');
    execSync(`${vercelCmd} login`, { stdio: 'inherit' });
  }
  
  // Create or update vercel.json
  const vercelConfig = {
    "version": 2,
    "builds": [{ "src": "next.config.js", "use": "@vercel/next" }],
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": supabaseUrl,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": supabaseKey
    }
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2), 'utf8');
  console.log('Created vercel.json with environment variables');
  
  // Link to existing project
  console.log('Linking to Vercel project...');
  try {
    execSync(`${vercelCmd} link --yes`, { stdio: 'inherit' });
  } catch (e) {
    console.log('Error linking project:', e.message);
    console.log('Continuing with setup...');
  }
  
  // Deploy
  console.log('Deploying to Vercel...');
  execSync(`${vercelCmd} deploy --prod --yes`, { stdio: 'inherit' });
  
  console.log('Vercel setup completed successfully!');
} catch (error) {
  console.error('Error during Vercel setup:', error.message);
} 