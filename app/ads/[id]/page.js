import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function generateMetadata({ params }) {
  const { data: ad } = await supabase
    .from('ads')
    .select('title, description')
    .eq('id', params.id)
    .single();

  if (!ad) return { title: 'Ad Not Found' };

  return {
    title: `${ad.title} | CYADS`,
    description: ad.description,
  };
}

export default async function AdDetailPage({ params }) {
  const { data: ad } = await supabase
    .from('ads')
    .select(`
      *,
      user:user_id (
        id,
        email,
        phone
      )
    `)
    .eq('id', params.id)
    .single();

  if (!ad) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={ad.image_url || '/placeholder.jpg'}
              alt={ad.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Ad Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{ad.location}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg">{ad.description}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-6">
              {ad.price} {ad.currency}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
            
            {/* Contact Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                <Phone className="w-5 h-5" />
                Call Seller
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors">
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </div>

            {/* Safety Tips */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Safety Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Meet in a public place</li>
                <li>• Check the item before you buy</li>
                <li>• Pay only after you've seen the item</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 