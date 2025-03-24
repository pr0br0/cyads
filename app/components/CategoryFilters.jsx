'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedLocation = useDebounce(location, 500);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    
    if (sort) params.set('sort', sort);
    else params.delete('sort');
    
    if (debouncedMinPrice) params.set('minPrice', debouncedMinPrice);
    else params.delete('minPrice');
    
    if (debouncedMaxPrice) params.set('maxPrice', debouncedMaxPrice);
    else params.delete('maxPrice');
    
    if (debouncedLocation) params.set('location', debouncedLocation);
    else params.delete('location');

    router.push(`?${params.toString()}`);
  }, [sort, debouncedMinPrice, debouncedMaxPrice, debouncedLocation, router, searchParams]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  );
} 