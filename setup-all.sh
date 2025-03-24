#!/bin/bash

echo "Starting setup for CyAds application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "NEXT_PUBLIC_SUPABASE_URL=https://zvyuurbieuionummrcqi.supabase.co" > .env.local
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU" >> .env.local
fi

# Set up the database and create test data
echo "Setting up Supabase database and creating test data..."
node setup-all.js

# Deploy to Vercel
echo "Deploying to Vercel..."
node setup-vercel.js

echo "Setup completed!"
echo "Your application should now be live at https://cyads-app.vercel.app/"
echo "Check the logs above for any errors that may have occurred." 