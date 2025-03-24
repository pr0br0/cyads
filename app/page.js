"use client";

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import CategoriesGrid from '../components/CategoriesGrid';
import FeaturedAds from '../components/FeaturedAds'; 

// Dynamic import for the Map component (to avoid SSR issues with Leaflet)
const Map = dynamic(() => import('../components/Map'), { ssr: false });

// Cyprus main cities location markers
const cyprusCities = [
  { position: [35.1856, 33.3823], popup: "Nicosia" },
  { position: [34.7071, 33.0226], popup: "Limassol" },
  { position: [34.9229, 33.6233], popup: "Larnaca" },
  { position: [34.7761, 32.4275], popup: "Paphos" },
  { position: [35.1856, 33.9171], popup: "Famagusta" }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero section */}
      <section className="relative h-[500px] w-full bg-gradient-to-r from-primary/80 to-primary overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Cyprus&apos; Premier<br />Classified Ads Platform
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-white/90">
            Find exactly what you&apos;re looking for across Cyprus with our multilingual classifieds platform.
          </p>
          <div className="mt-8 w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Link href="/categories" className="text-sm text-primary hover:underline">
            View all categories
          </Link>
        </div>
        <CategoriesGrid />
      </section>

      {/* Featured ads */}
      <section className="container">
        <FeaturedAds />
      </section>

      {/* Map section */}
      <section className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Explore Cyprus</h2>
          <p className="text-muted-foreground">Find ads in your desired location</p>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Map markers={cyprusCities} height="400px" className="w-full" />
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Ready to post your ad?</h2>
          <p className="mt-4 text-muted-foreground">
            Reach thousands of potential buyers across Cyprus
          </p>
          <div className="mt-8">
            <Link 
              href="/post-ad" 
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Post an Ad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 