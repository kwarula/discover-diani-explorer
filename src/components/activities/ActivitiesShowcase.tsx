import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, User, Clock, Star, ChevronRight, ImageOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useMarketListings, MarketListing } from '@/hooks/useMarketListings'; // Import hook and type

// TODO: Fetch categories dynamically or define them more robustly
const categories = [
  { id: 'all', label: 'All Activities' },
  { id: 'activity', label: 'General Activities' }, // Assuming 'activity' is a category
  { id: 'water-sports', label: 'Water Sports' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'cruises', label: 'Cruises' },
];

// TODO: Consider if difficulty filtering is needed with dynamic data
// const difficulties = [
//   { id: 'all', label: 'All Levels' },
//   { id: 'easy', label: 'Easy' },
//   { id: 'beginner', label: 'Beginner' },
//   { id: 'moderate', label: 'Moderate' },
//   { id: 'challenging', label: 'Challenging' },
// ];

export default function ActivitiesShowcase() {
  const [activeCategory, setActiveCategory] = useState('activity'); // Default to 'activity'
  // const [activeDifficulty, setActiveDifficulty] = useState('all'); // Difficulty filtering removed for now
  const [visibleCount, setVisibleCount] = useState(4);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});

  // Fetch listings using the hook
  const { 
    listings: allActivities, 
    loading: isLoadingListings, 
    error 
  } = useMarketListings({ 
    category: activeCategory === 'all' ? null : activeCategory, // Pass null for 'all'
    sortBy: 'newest', // Or another default sort
    // limit: 100 // Fetch more initially if filtering client-side, or handle pagination server-side
  });

  // Filter activities based on selected category (client-side for simplicity here)
  // Note: Ideally, filtering would be done server-side via the hook props
  const filteredActivities = allActivities; // Using all fetched for now
  // useEffect(() => {
  //   let result = allActivities;
  //   // Client-side filtering (if needed, but better done via hook)
  //   // if (activeCategory !== 'all') {
  //   //   result = result.filter(activity => activity.category === activeCategory);
  //   // }
  //   // if (activeDifficulty !== 'all') {
  //   //   result = result.filter(activity => activity.difficulty === activeDifficulty); // Assuming 'difficulty' field exists
  //   // }
  //   setFilteredActivities(result);
  // }, [activeCategory, allActivities]); // Removed activeDifficulty dependency

  // Load more activities (client-side pagination)
  const handleLoadMore = () => {
    // No simulated delay needed now
    setVisibleCount(prev => Math.min(prev + 4, filteredActivities.length));
  };

  // Handle image load success
  const handleImageLoad = (id: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [id]: true // Mark as loaded
    }));
  };

  // Handle image load error
  const handleImageError = (id: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [id]: false // Mark as failed
    }));
  };

  // Render loading state
  if (isLoadingListings && allActivities.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-coral animate-spin mb-4" />
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Compass className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-red-700 mb-2">Error loading activities</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Unforgettable <span className="text-coral">Experiences</span> in Diani
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and book the best activities and experiences that Diani Beach has to offer. Filter by category to find your perfect adventure.
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
          {/* Difficulty filters removed for simplicity with dynamic data */}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.slice(0, visibleCount).map((listing: MarketListing) => ( // Use MarketListing type
            <Card
              key={listing.id} // Use listing.id
              className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
            >
              <div className="relative h-48 overflow-hidden">
                {imageLoadingStates[listing.id] === false ? (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <ImageOff className="h-10 w-10 text-gray-400" />
                  </div>
                ) : (
                  <div className={cn(
                    "absolute inset-0 bg-gray-100 animate-pulse",
                    imageLoadingStates[listing.id] === true && "hidden" // Hide pulse when loaded
                  )}></div>
                )}
                <img
                  src={listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg'}
                  alt={listing.title || 'Listing image'}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                    imageLoadingStates[listing.id] === false && "hidden", // Hide img on error
                    imageLoadingStates[listing.id] !== true && "opacity-0" // Hide img until loaded
                  )}
                  onLoad={() => handleImageLoad(listing.id)}
                  onError={() => handleImageError(listing.id)}
                />
                <div className="absolute top-2 right-2">
                  {/* Use calculated average_rating from the hook */}
                  {listing.average_rating !== undefined && listing.average_rating > 0 && (
                    <Badge className="bg-yellow-400 text-yellow-900 flex items-center gap-1">
                      <Star className="h-3 w-3" /> {listing.average_rating.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
                  <div className="text-xs flex justify-between">
                    {/* Display relevant info if available (e.g., duration, review count) */}
                    {/* These fields might not exist directly on 'listings' table */}
                    {/* <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {listing.duration || 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" /> {listing.reviewCount || 0} reviews
                    </span> */}
                  </div>
                </div>
              </div>

              <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
                <h3 className="text-lg font-semibold line-clamp-1 mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>
                {/* Tags might need adjustment based on actual data structure */}
                {/* <div className="flex flex-wrap gap-1 mb-4">
                  {listing.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag.split('-').join(' ')}
                    </Badge>
                  ))}
                </div> */}
                <div className="mt-auto flex items-center justify-between">
                  {/* Display price if available */}
                  <span className="text-xl font-bold text-ocean">
                    {listing.price ? `$${listing.price.toFixed(2)}` : 'Contact for price'}
                  </span>
                  {/* Correct Link to listing detail page */}
                  <Link
                    to={`/listing/${listing.id}`} // Correct route
                    // Remove state transfer, detail page fetches its own data
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
              // Disable button if already showing all or loading
              disabled={visibleCount >= filteredActivities.length} 
            >
              Load More Activities
            </Button>
          </div>
        )}

        {/* No results message */}
        {!isLoadingListings && filteredActivities.length === 0 && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <Compass className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No activities found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later.
            </p>
            <Button
              onClick={() => { setActiveCategory('all'); }} // Reset only category
              variant="outline"
              className="mt-4 border-ocean text-ocean"
            >
              Show All Categories
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
