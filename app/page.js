"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/Button';
import { supabase } from '@/lib/supabase';
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
  const [featuredAds, setFeaturedAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedAds();
    fetchCategories();
  }, []);

  const fetchFeaturedAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          categories(*),
          profiles:user_id(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedAds(data);
    } catch (error) {
      console.error('Error fetching featured ads:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              Find Anything in Cyprus
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The largest marketplace in Cyprus. Buy and sell anything from cars to properties.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex shadow-lg rounded-lg overflow-hidden bg-white">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    className="block w-full px-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                    placeholder="What are you looking for?"
                  />
                </div>
                <div className="flex-shrink-0">
                  <button className="px-6 py-4 bg-primary text-white hover:bg-primary-dark focus:outline-none">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                      {category.icon && (
                        <span className={`text-${category.color}-600 text-2xl`}>
                          {category.icon}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.ad_count || 0} listings
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Ads</h2>
            <Link
              href="/search"
              className="text-primary hover:text-primary-dark flex items-center"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/ads/${ad.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={ad.main_image_url || '/placeholder.jpg'}
                    alt={ad.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary truncate">
                    {ad.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {ad.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {ad.location}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      {ad.price} {ad.currency}
                    </span>
                    {ad.negotiable && (
                      <span className="text-xs text-gray-500">Negotiable</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to sell something?
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              Join thousands of sellers who trust our platform
            </p>
            <div className="mt-8">
              <Button
                variant="default"
                size="lg"
                onClick={() => router.push('/ads/create')}
              >
                Post Your Ad Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 