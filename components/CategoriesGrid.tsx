"use client";

"use client";

import Link from 'next/link';
import { 
  Home,
  Car, 
  Briefcase, 
  Wrench, 
  Smartphone, 
  Sofa,
  ShoppingBag, 
  Book,
  Bike,
  Heart,
  Baby,
  Dog,
  LucideIcon
} from 'lucide-react';
import { Category as CategoryType } from '@/types/categories-grid';

interface CategoryItem {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
}

interface CategoriesGridProps {
  categories?: CategoryItem[];
}

export default function CategoriesGrid({ categories: propCategories }: CategoriesGridProps) {
  const categories: CategoryItem[] = propCategories || [
    { 
      name: "Property", 
      slug: "property", 
      icon: Home,
      color: "bg-blue-100 dark:bg-blue-900/20" 
    },
    { 
      name: "Vehicles", 
      slug: "vehicles", 
      icon: Car,
      color: "bg-red-100 dark:bg-red-900/20" 
    },
    { 
      name: "Jobs", 
      slug: "jobs", 
      icon: Briefcase,
      color: "bg-green-100 dark:bg-green-900/20" 
    },
    { 
      name: "Services", 
      slug: "services", 
      icon: Wrench,
      color: "bg-yellow-100 dark:bg-yellow-900/20" 
    },
    { 
      name: "Electronics", 
      slug: "electronics", 
      icon: Smartphone,
      color: "bg-purple-100 dark:bg-purple-900/20" 
    },
    { 
      name: "Furniture", 
      slug: "furniture", 
      icon: Sofa,
      color: "bg-orange-100 dark:bg-orange-900/20" 
    },
    { 
      name: "Clothing", 
      slug: "clothing", 
      icon: ShoppingBag,
      color: "bg-pink-100 dark:bg-pink-900/20" 
    },
    { 
      name: "Books", 
      slug: "books", 
      icon: Book,
      color: "bg-indigo-100 dark:bg-indigo-900/20" 
    },
    {
      name: "Sports", 
      slug: "sports", 
      icon: Bike,
      color: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    { 
      name: "Hobbies", 
      slug: "hobbies", 
      icon: Heart,
      color: "bg-rose-100 dark:bg-rose-900/20" 
    },
    { 
      name: "Baby Items", 
      slug: "baby-items", 
      icon: Baby,
      color: "bg-sky-100 dark:bg-sky-900/20" 
    },
    { 
      name: "Pets", 
      slug: "pets", 
      icon: Dog,
      color: "bg-amber-100 dark:bg-amber-900/20" 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories && categories.map((category) => (
        <Link 
          key={category.slug}
          href={`/categories/${category.slug}`}
          className={`${category.color} rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md`}
        >
          <category.icon className="h-10 w-10" />
          <span className="mt-2 font-medium text-center">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
