"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const router = useRouter();
  const t = useTranslations();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchTerm}&cat=${category}&loc=${location}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full bg-card rounded-lg shadow-sm p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('form.title')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('categories.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('categories.all')}</SelectItem>
              <SelectItem value="property">{t('categories.property')}</SelectItem>
              <SelectItem value="vehicles">{t('categories.vehicles')}</SelectItem>
              <SelectItem value="jobs">{t('categories.jobs')}</SelectItem>
              <SelectItem value="services">{t('categories.services')}</SelectItem>
              <SelectItem value="electronics">{t('categories.electronics')}</SelectItem>
              <SelectItem value="furniture">{t('categories.furniture')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex gap-2">
            <Select value={location} onValueChange={setLocation} className="flex-1">
              <SelectTrigger>
                <SelectValue placeholder={t('form.location')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cyprus</SelectItem>
                <SelectItem value="nicosia">Nicosia</SelectItem>
                <SelectItem value="limassol">Limassol</SelectItem>
                <SelectItem value="larnaca">Larnaca</SelectItem>
                <SelectItem value="paphos">Paphos</SelectItem>
                <SelectItem value="famagusta">Famagusta</SelectItem>
                <SelectItem value="kyrenia">Kyrenia</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">
              <Search className="md:hidden h-4 w-4" />
              <span className="hidden md:inline">{t('navigation.search')}</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
} 