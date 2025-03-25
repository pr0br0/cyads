#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const color = {
    info: colors.cyan,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red
  }[type];

  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    log(`Error executing command: ${command}`, 'error');
    log(error.message, 'error');
    process.exit(1);
  }
}

// Main deployment function
async function deploy() {
  log('🚀 Starting deployment process...', 'info');

  // Step 1: Install dependencies
  log('Installing dependencies...', 'info');
  execCommand('npm install');

  // Step 2: Push database changes to Supabase
  log('Pushing database changes to Supabase...', 'info');
  try {
    // Check if supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (error) {
    log('Installing Supabase CLI...', 'info');
    execCommand('npm install -g supabase-cli');
  }

  // Push database changes
  execCommand('supabase db push');

  // Step 3: Build the Next.js project
  log('Building Next.js project...', 'info');
  execCommand('npm run build');

  // Step 4: Deploy to Vercel
  log('Deploying to Vercel...', 'info');
  try {
    // Check if vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    log('Installing Vercel CLI...', 'info');
    execCommand('npm install --save-dev vercel');
  }

  // Create or update vercel.json
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "next.config.js",
        "use": "@vercel/next"
      }
    ],
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "https://zvyuurbieuionummrcqi.supabase.co",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU"
    }
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  log('Created vercel.json with environment variables', 'success');

  // Deploy to Vercel
  execCommand('npx vercel deploy --prod --yes');

  log('🎉 Deployment completed successfully!', 'success');
  log('\nNext steps:', 'info');
  log('1. Check your Vercel dashboard for deployment status', 'info');
  log('2. Verify your Supabase database changes', 'info');
  log('3. Test the deployed application', 'info');
}

// Run the deployment
deploy().catch((error) => {
  log('Deployment failed:', 'error');
  log(error.message, 'error');
  process.exit(1);
}); 