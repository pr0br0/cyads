"use client";

import { useTranslations } from 'next-intl';
import { Link } from 'next-intl/link';
import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for featured ads
const mockFeaturedAds = [
  {
    id: 1,
    title: 'Luxury Villa with Sea View',
    price: '€550,000',
    location: 'Limassol',
    category: 'property',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 2,
    title: 'Brand New Toyota Corolla 2023',
    price: '€27,900',
    location: 'Nicosia',
    category: 'vehicles',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: 3,
    title: 'Part-Time Customer Service Representative',
    price: '€15/hour',
    location: 'Larnaca',
    category: 'jobs',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: 4,
    title: 'Professional Plumbing Services',
    price: 'Negotiable',
    location: 'Paphos',
    category: 'services',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
  {
    id: 5,
    title: 'Apple MacBook Pro M2 - 16GB RAM - 512GB SSD',
    price: '€1,800',
    location: 'Nicosia',
    category: 'electronics',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 6,
    title: 'Italian Designer Sofa - Like New',
    price: '€750',
    location: 'Limassol',
    category: 'furniture',
    image: '/placeholder.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
];

export default function FeaturedAds() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockFeaturedAds.map((ad) => (
        <Link 
          key={ad.id} 
          href={`/ads/${ad.id}`}
          className="group rounded-lg border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all"
        >
          <div className="relative h-48 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image
              src={ad.image}
              alt={ad.title}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              fill
            />
            <div className="absolute bottom-3 left-3 z-20">
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {t(`categories.${ad.category}`) || ad.category}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {ad.title}
            </h3>
            <p className="mt-2 text-lg font-bold text-primary">{ad.price}</p>
            
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{ad.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formatDistanceToNow(ad.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 