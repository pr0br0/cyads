"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export default function FeaturedAds() {
  // Mock data for featured ads - this would come from an API in production
  const featuredAds = [
    {
      id: 1,
      title: 'Luxury Apartment for Rent in Limassol',
      price: '€1,200 / month',
      location: 'Limassol',
      category: 'Property',
      image: '/images/placeholder-1.jpg',
      slug: 'luxury-apartment-limassol',
    },
    {
      id: 2,
      title: '2019 Mercedes-Benz C-Class',
      price: '€24,500',
      location: 'Nicosia',
      category: 'Vehicles',
      image: '/images/placeholder-2.jpg',
      slug: 'mercedes-benz-c-class',
    },
    {
      id: 3,
      title: 'iPhone 13 Pro - Like New',
      price: '€650',
      location: 'Larnaca',
      category: 'Electronics',
      image: '/images/placeholder-3.jpg',
      slug: 'iphone-13-pro',
    },
    {
      id: 4,
      title: 'Full-Time Marketing Manager',
      price: 'Negotiable',
      location: 'Paphos',
      category: 'Jobs',
      image: '/images/placeholder-4.jpg',
      slug: 'marketing-manager-job',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Ads</h2>
        <Button variant="ghost" asChild>
          <Link href="/featured-ads" className="flex items-center">
            See all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredAds.map((ad) => (
          <Link key={ad.id} href={`/ads/${ad.slug}`}>
            <div className="group overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
              <div className="aspect-[4/3] w-full relative">
                <div className="absolute top-2 left-2 z-10 rounded-full px-2 py-1 text-xs font-medium bg-primary text-primary-foreground">
                  {ad.category}
                </div>
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{ad.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{ad.price}</span>
                  <span className="text-sm text-muted-foreground">{ad.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 