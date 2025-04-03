import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Palmtree, 
  UtensilsCrossed, 
  Car, 
  Building, 
  Music, 
  TreePine, 
  Waves, 
  ShoppingBag, 
  Coffee,
  Search
} from 'lucide-react';
import POICard from '@/components/POICard';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllPOIs } from '@/lib/supabase-helpers';
import { useQuery } from '@tanstack/react-query';
import { PointOfInterest } from '@/types/database';

const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  'Beaches': Waves,
  'Restaurants': UtensilsCrossed,
  'Transportation': Car,
  'Accommodations': Building,
  'Entertainment': Music,
  'Nature': TreePine,
  'Shopping': ShoppingBag,
  'Cafes': Coffee,
  'Points of Interest': Palmtree,
};

const PointsOfInterest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: pois, isLoading, isError, error } = useQuery(
    ['pois', selectedCategory],
    () => getAllPOIs(selectedCategory),
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPOIs = React.useMemo(() => {
    if (!pois) return [];

    return pois.filter((poi: PointOfInterest) => {
      const searchRegex = new RegExp(searchTerm, 'i');
      return searchRegex.test(poi.name) || searchRegex.test(poi.description);
    });
  }, [searchTerm, pois]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  const categoryList = [
    'Beaches',
    'Restaurants',
    'Transportation',
    'Accommodations',
    'Entertainment',
    'Nature',
    'Shopping',
    'Cafes',
    'Points of Interest',
  ];

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Points of Interest - Local Adventures</title>
        <meta name="description" content="Explore local points of interest." />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-4">Explore Points of Interest</h1>

      <div className="mb-4 flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search for places..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categoryList.map((category) => {
            const Icon = categoryIcons[category] || Palmtree;
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category}
              </button>
            );
          })}
          {selectedCategory && (
            <button
              onClick={clearCategory}
              className="flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Clear Category
            </button>
          )}
        </div>
      </div>

      {isLoading && <p>Loading points of interest...</p>}
      {isError && <p>Error: {error?.message || 'Failed to load points of interest.'}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPOIs.map((poi) => (
          <POICard key={poi.id} poi={poi} />
        ))}
      </div>

      {filteredPOIs.length === 0 && !isLoading && !isError && (
        <div className="text-center py-6">
          <p className="text-lg text-gray-500">No points of interest found.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default PointsOfInterest;
