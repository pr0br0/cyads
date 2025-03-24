"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CyAds</h3>
            <p className="text-sm text-muted-foreground">
              The premier classifieds platform for Cyprus, connecting buyers and sellers across the island.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="text-sm text-muted-foreground hover:text-primary">
                  Post Ad
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/property" className="text-sm text-muted-foreground hover:text-primary">
                  Property
                </Link>
              </li>
              <li>
                <Link href="/categories/vehicles" className="text-sm text-muted-foreground hover:text-primary">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/categories/jobs" className="text-sm text-muted-foreground hover:text-primary">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/categories/services" className="text-sm text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>Email: info@cyads.cy</p>
              <p>Phone: +357 99 123456</p>
              <p>Limassol, Cyprus</p>
            </address>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CyAds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 