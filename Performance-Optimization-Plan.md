# Performance Optimization Plan for CyAds

## Current Performance Assessment

Based on the codebase review, the main performance opportunities are:

1. Image loading and optimization
2. Bundle size reduction
3. Data fetching efficiency
4. Rendering performance
5. Caching strategies

## Optimization Strategies

### 1. Image Optimization

#### Implement Next.js Image Component

```jsx
// Replace all <img> tags with Next.js Image component
import Image from 'next/image';

function AdImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}  // Set appropriate dimensions
      height={600}
      className="object-cover"
      priority={false} // Only for above-the-fold images
      quality={75} // Reduce quality for smaller files
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

#### Add Image Processing

```bash
# Install sharp for image optimization
npm install sharp
```

Configure in `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['zvyuurbieuionummrcqi.supabase.co'], // Add your image domains
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 2. Bundle Size Reduction

#### Analyze Bundle

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer --save-dev
```

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});
```

Run analysis:
```bash
ANALYZE=true npm run build
```

#### Optimize Dependencies

1. Review large dependencies
2. Replace heavy libraries with lighter alternatives
3. Use dynamic imports for non-critical components

```jsx
// Example of dynamic import
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

#### Tree Shaking

Ensure your build is properly tree shaking unused code:

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: [
      'react-icons',
      'lodash-es',
      'date-fns'
    ]
  }
};
```

### 3. Data Fetching Efficiency

#### Implement SWR for Client-Side Data

```bash
npm install swr
```

```jsx
import useSWR from 'swr';

function FeaturedAds() {
  const { data, error } = useSWR('/api/featured-ads', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
```

#### Optimize Supabase Queries

```jsx
// Before
const { data } = await supabase
  .from('ads')
  .select('*')
  .eq('status', 'published');

// After - only select needed columns
const { data } = await supabase
  .from('ads')
  .select('id, title, price, main_image_url, location')
  .eq('status', 'published')
  .limit(20);
```

#### Implement Pagination

```jsx
async function loadMoreAds(lastId) {
  const { data } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false })
    .lt('id', lastId)
    .limit(10);
  
  return data;
}
```

### 4. Rendering Performance

#### Optimize Re-renders

```jsx
// Use React.memo for expensive components
const AdCard = React.memo(function AdCard({ ad }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Ad content */}
    </div>
  );
});
```

#### Virtualize Long Lists

```bash
npm install react-window
```

```jsx
import { FixedSizeList as List } from 'react-window';

function AdList({ ads }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <AdCard ad={ads[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={ads.length}
      itemSize={300}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

#### Use useCallback for Event Handlers

```jsx
const handleSearch = useCallback((query) => {
  // Search logic
}, []);
```

### 5. Caching Strategies

#### Service Worker for Offline Support

```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cyads-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/main.js',
        '/images/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### API Response Caching

```javascript
// pages/api/ads.js
export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  );
  
  // API logic
}
```

#### CDN Caching

Configure in `next.config.js`:

```javascript
module.exports = {
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

### Implementation Timeline

1. **Week 1**: Image optimization and bundle analysis
2. **Week 2**: Data fetching improvements and pagination
3. **Week 3**: Rendering optimizations and memoization
4. **Week 4**: Caching strategies implementation
5. **Ongoing**: Performance monitoring and tuning

## Monitoring Tools

1. **Lighthouse**: For performance audits
2. **WebPageTest**: For real-world performance metrics
3. **Sentry**: For performance monitoring in production
4. **Custom Metrics**: Track key performance indicators

```javascript
// Track important metrics
const trackMetrics = () => {
  const metrics = {
    loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
    firstPaint: window.performance.getEntriesByName('first-paint')[0].startTime,
    firstContentfulPaint: window.performance.getEntriesByName('first-contentful-paint')[0].startTime,
  };
  
  // Send to analytics
  supabase.from('performance_metrics').insert(metrics);
};

// Run after page load
window.addEventListener('load', trackMetrics);
```

## Key Performance Indicators

1. **First Contentful Paint (FCP)**: < 1.8s
2. **Largest Contentful Paint (LCP)**: < 2.5s
3. **Time to Interactive (TTI)**: < 3.5s
4. **Total Blocking Time (TBT)**: < 200ms
5. **Cumulative Layout Shift (CLS)**: < 0.1

By implementing these optimizations, CyAds will achieve significantly better performance across all devices and network conditions.
