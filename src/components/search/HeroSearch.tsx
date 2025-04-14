import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'activities', name: 'Activities' },
  { id: 'accommodations', name: 'Accommodations' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'tours', name: 'Tours' },
  { id: 'beaches', name: 'Beaches' },
];

const popularSearches = [
  { id: '1', text: 'Diani Beach activities', category: 'activities' },
  { id: '2', text: 'Best restaurants in Diani', category: 'restaurants' },
  { id: '3', text: 'Luxury beach resorts', category: 'accommodations' },
  { id: '4', text: 'Snorkeling trips', category: 'activities' },
  { id: '5', text: 'Safari day tours', category: 'tours' },
];

export default function HeroSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    // Construct well-formed query parameters
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    
    if (selectedCategory !== 'all') {
      params.append('category', selectedCategory);
    }
    
    if (location.trim()) {
      params.append('location', location.trim());
    }
    
    // Generate the URL with query parameters
    const searchUrl = `/explore${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Navigate to the explore page with query parameters
    navigate(searchUrl);
    
    // Reset state after a delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setLocation('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2 md:p-4 transition-all duration-300 animate-fade-in">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="What are you looking for?"
            className="pl-10 pr-10 py-6 rounded-lg border-gray-200 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Popular searches shown only when input is focused and empty */}
          {inputFocused && searchQuery === '' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 border border-gray-100">
              <p className="text-xs text-gray-500 mb-2 px-2">Popular Searches</p>
              {popularSearches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setSearchQuery(item.text);
                    setSelectedCategory(item.category);
                  }}
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
            <PopoverTrigger asChild>
              <Button 
                type="button"
                variant="outline" 
                className="flex items-center justify-between gap-2 whitespace-nowrap py-6 px-4"
              >
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className={location ? "text-gray-900" : "text-gray-500"}>
                  {location || "All Locations"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandList>
                  <CommandEmpty>No locations found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem 
                      onSelect={() => {
                        setLocation("Diani Beach");
                        setIsLocationOpen(false);
                      }}
                    >
                      Diani Beach
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => {
                        setLocation("Tiwi Beach");
                        setIsLocationOpen(false);
                      }}
                    >
                      Tiwi Beach
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => {
                        setLocation("Galu Beach");
                        setIsLocationOpen(false);
                      }}
                    >
                      Galu Beach
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => {
                        setLocation("Chale Island");
                        setIsLocationOpen(false);
                      }}
                    >
                      Chale Island
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => {
                        setLocation("");
                        setIsLocationOpen(false);
                      }}
                    >
                      All Locations
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <div className="flex sm:flex-row flex-col gap-2">
            <select
              className="bg-white border border-gray-200 rounded-lg text-gray-700 py-6 px-4"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="flex gap-2">
              {(searchQuery || location || selectedCategory !== 'all') && (
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={clearSearch}
                  className="py-6 px-4 text-gray-500 hover:text-gray-700"
                  title="Clear all filters"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-ocean hover:bg-ocean-dark text-white py-6 px-6 rounded-lg transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 