# CyAds - Multilingual Classifieds Platform for Cyprus

CyAds is a modern classifieds platform built specifically for the Cyprus market, offering a comprehensive solution for buying, selling, and advertising services across the island.

## Features

- **Multilingual Support**: Full interface in English, Greek, and Russian
- **Location-Based Browsing**: Find listings by city/region within Cyprus
- **Category-Based Navigation**: Browse ads by category (Property, Vehicles, Jobs, etc.)
- **Responsive Design**: Mobile-friendly interface with dark/light mode support
- **Interactive Map**: Visual browsing of listings across Cyprus regions
- **Authentication**: Secure login via email, phone, or social providers

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **UI**: Tailwind CSS + ShadCN components
- **Internationalization**: next-intl
- **Map**: Leaflet.js with OpenStreetMap

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Search**: PostgreSQL full-text search

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is configured for deployment on Vercel with Supabase as the backend, providing:

- Fast global edge network
- Automatic HTTPS
- Environment variable management
- EU data residency for GDPR compliance

## License

This project is licensed under the MIT License
