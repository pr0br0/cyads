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

  // Check if vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    log('Installing Vercel CLI...', 'info');
    execCommand('npm install -g vercel');
  }

  // Ensure all dependencies are installed
  log('Installing dependencies...', 'info');
  execCommand('npm install');

  // Build the project
  log('Building project...', 'info');
  execCommand('npm run build');

  // Deploy to Vercel
  log('Deploying to Vercel...', 'info');
  execCommand('vercel --prod');

  log('🎉 Deployment completed successfully!', 'success');
  log('\nNext steps:', 'info');
  log('1. Check your Vercel dashboard for deployment status', 'info');
  log('2. Verify your environment variables are set correctly', 'info');
  log('3. Test the deployed application', 'info');
}

// Run the deployment
deploy().catch((error) => {
  log('Deployment failed:', 'error');
  log(error.message, 'error');
  process.exit(1);
}); 