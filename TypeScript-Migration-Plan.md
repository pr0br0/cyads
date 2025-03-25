# TypeScript Migration Plan for CyAds

## Current Status
- Partial TypeScript implementation in the `cyads-app` directory
- Main project still using JavaScript (.js/.jsx)

## Migration Steps

### 1. Setup TypeScript Configuration

Ensure the root project has a proper TypeScript configuration:

```bash
# Install TypeScript and type definitions
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

Create a comprehensive `tsconfig.json` at the root level:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "cyads-app"]
}
```

### 2. Create Type Definitions

Create a `types` directory with type definitions for your data models:

```typescript
// types/index.ts

// User types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: string;
  name_en: string;
  name_el: string;
  name_ru: string;
  slug: string;
  icon?: string;
  color?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  name?: string; // Localized name
}

// Location types
export interface Location {
  id: string;
  name_en: string;
  name_el: string;
  name_ru: string;
  slug: string;
  coordinates: any; // GeometryPoint
  parent_id?: string;
  created_at: string;
  updated_at: string;
  name?: string; // Localized name
}

// Ad types
export interface Ad {
  id: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  category_id: string;
  location_id: string;
  coordinates?: any; // GeometryPoint
  user_id: string;
  status: 'draft' | 'published' | 'expired' | 'sold' | 'deleted';
  is_featured: boolean;
  contact_phone?: string;
  contact_email?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  
  // Relations
  categories?: Category;
  locations?: Location;
  users?: User;
  image_urls?: string[];
  main_image_url?: string;
}

// Form types
export interface AdFormData {
  title: string;
  description: string;
  price: string | number;
  currency: string;
  category_id: string;
  location: string;
  negotiable: boolean;
  condition: string;
  tags: string[];
}
```

### 3. Migration Priority Order

1. **Utility Functions First**
   - Convert `lib/supabase.js` → `lib/supabase.ts`
   - Convert `lib/utils.js` → `lib/utils.ts`

2. **Components Next**
   - Convert UI components in `components/ui/`
   - Convert shared components like `Map.jsx`, `SearchBar.jsx`

3. **Context Providers**
   - Convert `app/context/AuthContext.jsx` → `app/context/AuthContext.tsx`

4. **Pages Last**
   - Convert page components starting with simpler ones

### 4. Component Migration Example

Original JavaScript component:
```jsx
// components/SearchBar.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-2 border rounded-l-lg"
        placeholder="Search..."
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded-r-lg">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
```

TypeScript version:
```tsx
// components/SearchBar.tsx
import { useState, FormEvent, ChangeEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="flex-grow px-4 py-2 border rounded-l-lg"
        placeholder="Search..."
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded-r-lg">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
```

### 5. Supabase Client with TypeScript

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { Ad, Category, Location } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Data fetching functions with proper typing
export async function getCategories(locale = 'en'): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name_en, name_el, name_ru, icon, color, parent_id')
    .order('name_en');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Add localized name property based on the locale
  return data.map(category => ({
    ...category,
    name: category[`name_${locale}` as keyof typeof category] as string || category.name_en
  }));
}

// Add similar type annotations to other functions
```

### 6. Testing the Migration

After converting each file, run TypeScript checks:

```bash
npx tsc --noEmit
```

Fix any type errors before moving to the next file.

### 7. Incremental Adoption Strategy

- Start with new features in TypeScript
- Convert existing files gradually
- Use `// @ts-check` in JavaScript files for basic type checking before full conversion
