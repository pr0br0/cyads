"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    console.log({ query, category, location });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl bg-background shadow-lg rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <Input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="jobs">Jobs</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cyprus</SelectItem>
              <SelectItem value="nicosia">Nicosia</SelectItem>
              <SelectItem value="limassol">Limassol</SelectItem>
              <SelectItem value="larnaca">Larnaca</SelectItem>
              <SelectItem value="paphos">Paphos</SelectItem>
              <SelectItem value="famagusta">Famagusta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1">
          <Button type="submit" className="w-full h-full">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
} 