"use client";

import { useTranslations } from 'next-intl';
import { Link } from 'next-intl/link';
import { 
  Home, Car, Briefcase, Wrench, Smartphone, Sofa, Gift, 
  ShoppingCart, Building, Utensils, GraduationCap, Bike 
} from 'lucide-react';

export default function CategoriesGrid() {
  const t = useTranslations();

  const categories = [
    { 
      name: t('categories.property'), 
      icon: <Home className="h-6 w-6" />, 
      href: '/categories/property',
      color: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-500'
    },
    { 
      name: t('categories.vehicles'), 
      icon: <Car className="h-6 w-6" />, 
      href: '/categories/vehicles',
      color: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-500'
    },
    { 
      name: t('categories.jobs'), 
      icon: <Briefcase className="h-6 w-6" />, 
      href: '/categories/jobs',
      color: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-500'
    },
    { 
      name: t('categories.services'), 
      icon: <Wrench className="h-6 w-6" />, 
      href: '/categories/services',
      color: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-500'
    },
    { 
      name: t('categories.electronics'), 
      icon: <Smartphone className="h-6 w-6" />, 
      href: '/categories/electronics',
      color: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-500'
    },
    { 
      name: t('categories.furniture'), 
      icon: <Sofa className="h-6 w-6" />, 
      href: '/categories/furniture',
      color: 'bg-teal-100 dark:bg-teal-900/20',
      iconColor: 'text-teal-500'
    },
    { 
      name: 'Gifts', 
      icon: <Gift className="h-6 w-6" />, 
      href: '/categories/gifts',
      color: 'bg-pink-100 dark:bg-pink-900/20',
      iconColor: 'text-pink-500'
    },
    { 
      name: 'Retail', 
      icon: <ShoppingCart className="h-6 w-6" />, 
      href: '/categories/retail',
      color: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-500'
    },
    { 
      name: 'Commercial', 
      icon: <Building className="h-6 w-6" />, 
      href: '/categories/commercial',
      color: 'bg-indigo-100 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-500'
    },
    { 
      name: 'Food', 
      icon: <Utensils className="h-6 w-6" />, 
      href: '/categories/food',
      color: 'bg-cyan-100 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-500'
    },
    { 
      name: 'Education', 
      icon: <GraduationCap className="h-6 w-6" />, 
      href: '/categories/education',
      color: 'bg-amber-100 dark:bg-amber-900/20',
      iconColor: 'text-amber-500'
    },
    { 
      name: 'Sports', 
      icon: <Bike className="h-6 w-6" />, 
      href: '/categories/sports',
      color: 'bg-lime-100 dark:bg-lime-900/20',
      iconColor: 'text-lime-500'
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <Link 
          key={index} 
          href={category.href}
          className="group flex flex-col items-center p-4 rounded-lg border border-border hover:border-primary transition-colors"
        >
          <div className={`mb-3 p-3 rounded-full ${category.color} ${category.iconColor} group-hover:text-primary`}>
            {category.icon}
          </div>
          <span className="text-sm font-medium text-center group-hover:text-primary">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
} 