import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, User, Clock, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Sample data - in real app, this would come from an API
const activities = [
  {
    id: '1',
    title: 'Diani Reef Snorkeling Adventure',
    description: 'Explore the vibrant coral reefs and marine life just off the shores of Diani Beach.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '3 hours',
    rating: 4.8,
    reviewCount: 124,
    price: 45,
    category: 'water-sports',
    tags: ['snorkeling', 'marine-life', 'guided-tour', 'family-friendly'],
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Sunset Dhow Cruise with Dinner',
    description: 'Sail on a traditional dhow as the sun sets over the Indian Ocean, followed by a fresh seafood dinner.',
    image: 'https://images.unsplash.com/photo-1586508577428-120d6f507358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '4 hours',
    rating: 4.9,
    reviewCount: 87,
    price: 75,
    category: 'cruises',
    tags: ['sunset', 'dhow', 'dinner', 'romantic'],
    difficulty: 'easy',
  },
  {
    id: '3',
    title: 'Colobus Monkey Forest Walk',
    description: 'Guided walk through the coastal forest to spot the rare Angolan colobus monkeys and other wildlife.',
    image: 'https://images.unsplash.com/photo-1612289000645-cddd60260554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '2 hours',
    rating: 4.6,
    reviewCount: 65,
    price: 30,
    category: 'wildlife',
    tags: ['monkeys', 'nature', 'guided-tour', 'educational'],
    difficulty: 'easy',
  },
  {
    id: '4',
    title: 'Kitesurfing Lessons for Beginners',
    description: 'Learn the basics of kitesurfing with professional instructors in the perfect conditions of Diani Beach.',
    image: 'https://images.unsplash.com/photo-1525012473586-afdb0fba8ef5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '2 hours',
    rating: 4.7,
    reviewCount: 53,
    price: 65,
    category: 'water-sports',
    tags: ['kitesurfing', 'lessons', 'beginner', 'adventure'],
    difficulty: 'moderate',
  },
  {
    id: '5',
    title: 'Skydiving Over Diani Beach',
    description: 'Experience the ultimate adrenaline rush with a tandem skydive overlooking the stunning coastline.',
    image: 'https://images.unsplash.com/photo-1603798125914-7b5d27789248?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '3 hours',
    rating: 5.0,
    reviewCount: 42,
    price: 290,
    category: 'adventure',
    tags: ['skydiving', 'extreme', 'adrenaline', 'views'],
    difficulty: 'challenging',
  },
  {
    id: '6',
    title: 'Local Cuisine Cooking Class',
    description: 'Learn to prepare traditional Swahili dishes using fresh local ingredients with expert local chefs.',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '4 hours',
    rating: 4.9,
    reviewCount: 38,
    price: 55,
    category: 'cultural',
    tags: ['cooking', 'culture', 'food', 'learning'],
    difficulty: 'easy',
  },
  {
    id: '7',
    title: 'Deep Sea Fishing Expedition',
    description: 'Head out to the deep waters for a chance to catch sailfish, marlin, tuna and other game fish.',
    image: 'https://images.unsplash.com/photo-1544997985-d68fc684aae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '6 hours',
    rating: 4.7,
    reviewCount: 29,
    price: 150,
    category: 'water-sports',
    tags: ['fishing', 'deep-sea', 'boat', 'adventure'],
    difficulty: 'moderate',
  },
  {
    id: '8',
    title: 'Shimba Hills Safari Day Trip',
    description: 'Explore the nearby Shimba Hills National Reserve to see elephants, antelopes and other wildlife.',
    image: 'https://images.unsplash.com/photo-1509479100390-f83a8349e79c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '8 hours',
    rating: 4.8,
    reviewCount: 74,
    price: 110,
    category: 'wildlife',
    tags: ['safari', 'elephants', 'nature', 'day-trip'],
    difficulty: 'easy',
  },
];

// Filter categories
const categories = [
  { id: 'all', label: 'All Activities' },
  { id: 'water-sports', label: 'Water Sports' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'cruises', label: 'Cruises' },
];

// Filter by difficulty
const difficulties = [
  { id: 'all', label: 'All Levels' },
  { id: 'easy', label: 'Easy' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'challenging', label: 'Challenging' },
];

export default function ActivitiesShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [visibleCount, setVisibleCount] = useState(4);
  
  // Apply filters when they change
  useEffect(() => {
    let result = activities;
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(activity => activity.category === activeCategory);
    }
    
    // Filter by difficulty
    if (activeDifficulty !== 'all') {
      result = result.filter(activity => activity.difficulty === activeDifficulty);
    }
    
    setFilteredActivities(result);
  }, [activeCategory, activeDifficulty]);
  
  // Load more activities
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, filteredActivities.length));
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Unforgettable <span className="text-coral">Experiences</span> in Diani
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and book the best activities and experiences that Diani Beach has to offer. Filter by category, difficulty, or duration to find your perfect adventure.
          </p>
        </div>
        
        {/* Category filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={cn(
                  activeCategory === category.id && "bg-coral hover:bg-coral-dark"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {difficulties.map(difficulty => (
              <Badge
                key={difficulty.id}
                variant={activeDifficulty === difficulty.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-1 text-sm",
                  activeDifficulty === difficulty.id 
                    ? "bg-ocean hover:bg-ocean-dark" 
                    : "hover:bg-gray-100"
                )}
                onClick={() => setActiveDifficulty(difficulty.id)}
              >
                {difficulty.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.slice(0, visibleCount).map(activity => (
            <Card 
              key={activity.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-400 text-yellow-900 flex items-center gap-1">
                    <Star className="h-3 w-3" /> {activity.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
                  <div className="text-xs flex justify-between">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {activity.duration}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" /> {activity.reviewCount} reviews
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
                <h3 className="text-lg font-semibold line-clamp-1 mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{activity.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {activity.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag.split('-').join(' ')}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-ocean">${activity.price}</span>
                  <Link 
                    to={`/activities/${activity.id}`}
                    className="flex items-center text-coral hover:text-coral-dark font-medium text-sm"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Load more button */}
        {visibleCount < filteredActivities.length && (
          <div className="text-center mt-10">
            <Button 
              onClick={handleLoadMore}
              variant="outline" 
              className="border-ocean text-ocean hover:bg-ocean/5"
            >
              Load More Activities
            </Button>
          </div>
        )}
        
        {/* No results message */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <Compass className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No activities found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to find more exciting experiences.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 