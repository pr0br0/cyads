# Advanced Search Implementation Plan for CyAds

## Current Search Capabilities

The current search implementation appears to be basic, with simple text matching. We can enhance it with:

1. Full-text search with ranking
2. Filtering by multiple criteria
3. Location-based search
4. Autocomplete suggestions
5. Saved searches and alerts

## Technical Implementation

### 1. Database Preparation

#### Enable Full-Text Search in Supabase

```sql
-- Add a generated column for search
ALTER TABLE ads ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;

-- Create an index
CREATE INDEX idx_ads_search ON ads USING GIN(search_vector);
```

#### Create Search Function

```sql
CREATE OR REPLACE FUNCTION search_ads(query text, category_id uuid DEFAULT NULL, 
                                     location_id uuid DEFAULT NULL, 
                                     min_price numeric DEFAULT NULL, 
                                     max_price numeric DEFAULT NULL)
RETURNS SETOF ads AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM ads
  WHERE 
    status = 'published' AND
    (category_id IS NULL OR category_id = $2) AND
    (location_id IS NULL OR location_id = $3) AND
    (min_price IS NULL OR price >= $4) AND
    (max_price IS NULL OR price <= $5) AND
    search_vector @@ websearch_to_tsquery('english', $1)
  ORDER BY 
    ts_rank(search_vector, websearch_to_tsquery('english', $1)) DESC,
    created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

### 2. Backend Implementation

#### Create Search API Endpoint

```javascript
// pages/api/search.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { query, category, location, minPrice, maxPrice, page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const { data, error } = await supabase.rpc('search_ads', {
      query,
      category_id: category || null,
      location_id: location || null,
      min_price: minPrice ? parseFloat(minPrice) : null,
      max_price: maxPrice ? parseFloat(maxPrice) : null
    })
    .range(offset, offset + limit - 1);

    if (error) throw error;

    res.status(200).json({
      results: data,
      page,
      totalPages: Math.ceil(data.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 3. Frontend Components

#### Search Bar with Autocomplete

```jsx
// components/AdvancedSearch.jsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Search, X, Filter } from 'lucide-react';
import { debounce } from 'lodash';

export default function AdvancedSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(debounce(async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const { data } = await supabase
      .from('ads')
      .select('title')
      .textSearch('search_vector', q, {
        type: 'websearch',
        config: 'english'
      })
      .limit(5);
      
    setSuggestions(data?.map(item => item.title) || []);
  }, 300), []);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anything..."
          className="flex-grow px-4 py-3 focus:outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-3 text-gray-500 hover:text-primary"
        >
          <Filter className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleSearch}
          className="px-4 py-3 bg-primary text-white hover:bg-primary-dark"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {suggestions.map((suggestion, i) => (
            <div 
              key={i}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {/* Filters panel */}
      {showFilters && (
        <div className="absolute z-10 w-full mt-2 p-4 bg-white border rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (€)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (€)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Any"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  location: '',
                  minPrice: '',
                  maxPrice: ''
                });
                setShowFilters(false);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Search Results Page

```jsx
// pages/search.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdCard from '@/components/AdCard';
import { supabase } from '@/lib/supabase';

export default function SearchPage() {
  const router = useRouter();
  const { query: searchQuery, category, location, minPrice, maxPrice, page } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (category) params.set('category', category);
      if (location) params.set('location', location);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (page) params.set('page', page);
      
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      
      setResults(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchResults();
  }, [searchQuery, category, location, minPrice, maxPrice, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Search results for "${searchQuery}"` : 'Browse all ads'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No results found</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => {
                  router.push({
                    pathname: '/search',
                    query: { ...router.query, page: parseInt(page || 1) - 1 }
                  });
                }}
                disabled={!page || parseInt(page) <= 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => {
                    router.push({
                      pathname: '/search',
                      query: { ...router.query, page: num }
                    });
                  }}
                  className={`px-3 py-1 border rounded-md ${(parseInt(page || 1) === num) ? 'bg-primary text-white' : ''}`}
                >
                  {num}
                </button>
              ))}
              
              <button
                onClick={() => {
                  router.push({
                    pathname: '/search',
                    query: { ...router.query, page: parseInt(page || 1) + 1 }
                  });
                }}
                disabled={parseInt(page || 1) >= totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
```

### 5. Saved Searches and Alerts

#### Database Schema Additions

```sql
-- Add saved_searches table
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query_params JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER set_saved_searches_updated_at
BEFORE UPDATE ON saved_searches
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### API Endpoint for Saved Searches

```javascript
// pages/api/saved-searches.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { method, body, query } = req;
  const { user } = await supabase.auth.api.getUserByCookie(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.status(200).json(data);
      break;
      
    case 'POST':
      const { name, query_params } = body;
      const { data: newSearch, error: postError } = await supabase
        .from('saved_searches')
        .insert([{ 
          user_id: user.id,
          name,
          query_params 
        }])
        .single();
      
      if (postError) throw postError;
      res.status(201).json(newSearch);
      break;
      
    case 'DELETE':
      const { id } = query;
      const { error: deleteError } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      res.status(204).end();
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

## Implementation Timeline

1. **Week 1**: Database setup and backend API implementation
2. **Week 2**: Frontend search components and results page
3. **Week 3**: Saved searches and alerts functionality
4. **Week 4**: Testing and performance optimization
5. **Ongoing**: Monitoring and iterative improvements

## Key Features

1. **Full-text search** with relevance ranking
2. **Advanced filtering** by category, location, price range
3. **Autocomplete suggestions** as you type
4. **Pagination** for browsing large result sets
5. **Saved searches** with email alerts for new matches
6. **Mobile-optimized** search interface

This enhanced search functionality will significantly improve the user experience and help users find exactly what they're looking for more efficiently.
