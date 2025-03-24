import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar } from 'lucide-react';
import CategoryFilters from '@/components/CategoryFilters';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function generateMetadata({ params }) {
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} | CYADS`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { sort = 'newest', minPrice, maxPrice, location } = searchParams;

  // Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) notFound();

  // Build query for ads
  let query = supabase
    .from('ads')
    .select('*')
    .eq('category_id', category.id);

  // Apply filters
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);
  if (location) query = query.ilike('location', `%${location}%`);

  // Apply sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: ads } = await query;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
      </div>

      {/* Filters */}
      <CategoryFilters />

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ads?.map((ad) => (
          <Link
            key={ad.id}
            href={`/ads/${ad.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={ad.image_url || '/placeholder.jpg'}
                alt={ad.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold mb-2 line-clamp-2">{ad.title}</h2>
              <div className="text-xl font-bold text-primary mb-2">
                {ad.price} {ad.currency}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{ad.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {(!ads || ads.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No ads found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
} 