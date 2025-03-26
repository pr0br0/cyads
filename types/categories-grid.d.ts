import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Category {
  name: string;
  slug: string;
  icon: React.ReactNode; // Changed to React.ReactNode
  color: string;
}

export interface CategoriesGridProps {
  categories: Category[];
}
