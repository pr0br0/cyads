'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useDebounce } from '../hooks/useDebounce';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CategoryFilters({ categorySlug, onFilterChange }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedLocation = useDebounce(location, 500);
  
  useEffect(() => {
    onFilterChange({
      minPrice: debouncedMinPrice ? parseFloat(debouncedMinPrice) : null,
      maxPrice: debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : null,
      location: debouncedLocation || null
    });
  }, [debouncedMinPrice, debouncedMaxPrice, debouncedLocation, onFilterChange]);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
            Min Price (€)
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Minimum price"
          />
        </div>
        
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
            Max Price (€)
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Maximum price"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="City, area, etc."
          />
        </div>
      </div>
    </div>
  );
} 