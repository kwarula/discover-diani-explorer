
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Loader2, Compass } from 'lucide-react'; // Import Loader2 and Compass
import { Link } from 'react-router-dom'; // Import Link
import { useMarketListings, MarketListing } from '@/hooks/useMarketListings'; // Import hook and type
import { cn } from '@/lib/utils'; // Import cn

// Sample data for experience cards - REMOVED, will fetch dynamically
/*
const experiences = [
  {
    id: 1,
    title: "Diani Beach Snorkeling Adventure",
    image: "https://images.unsplash.com/photo-1599687266725-0195e2fd67df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.8,
    reviews: 124,
    price: "$45",
    tags: ["Water Sports", "Adventure"],
    featured: true
  },
  {
    id: 2,
    title: "Colobus Monkey Sanctuary Tour",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.9,
    reviews: 89,
    price: "$30",
    tags: ["Wildlife", "Nature"]
  },
  {
    id: 3,
    title: "Sunset Dhow Cruise with Dinner",
    image: "https://images.unsplash.com/photo-1569254982547-710fe9f466d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
    rating: 4.7,
    reviews: 156,
    price: "$65",
    tags: ["Dining", "Romantic"]
  },
  {
    id: 4,
    title: "Traditional Swahili Cooking Class",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.6,
    reviews: 72,
    price: "$40",
    tags: ["Cultural", "Food"]
  }
];
*/

// Updated ExperienceCard to accept MarketListing and link correctly
const ExperienceCard = ({ listing }: { listing: MarketListing }) => {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg';

  return (
    <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02] duration-300 flex flex-col"> {/* Added flex flex-col */}
      {/* Link the image and main content area */}
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative">
          <img
            src={imageUrl}
            alt={listing.title || 'Experience image'}
            className="w-full h-48 object-cover"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
          {listing.featured && ( // Check if 'featured' exists and is true
            <div className="absolute top-2 left-2">
              <Badge className="bg-coral text-white">Featured</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            {listing.average_rating !== undefined && listing.average_rating > 0 && (
              <div className="flex items-center bg-black/70 text-white text-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                <span>{listing.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow"> {/* Added flex-grow */}
          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1">{listing.title}</h3>

          {/* Tags might need adjustment based on actual data structure */}
          {/* <div className="flex flex-wrap gap-2 mb-3">
            {listing.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">{tag}</Badge>
            ))}
          </div> */}

          {/* Price and Details Button */}
          <div className="mt-auto flex justify-between items-center pt-3"> {/* Added pt-3 for spacing */}
            <div>
              <span className="font-bold text-lg">
                {listing.price !== null && listing.price !== undefined
                  ? `$${listing.price.toLocaleString()}`
                  : 'Contact'}
              </span>
              {listing.price !== null && listing.price !== undefined && (
                <span className="text-gray-500 text-sm"> / {listing.price_unit || 'item'}</span>
              )}
            </div>
            {/* Keep button visually separate but whole card links */}
            <Button variant="outline" className="text-ocean border-ocean hover:bg-ocean/10 pointer-events-none">View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

const ExperienceSection = () => {
  // Fetch featured/popular listings (e.g., limit 4, sort by rating or featured status)
  const {
    listings: popularListings, // Renamed for clarity
    loading,
    error
  } = useMarketListings({
    // Assuming 'featured' is a boolean column you can filter/sort by
    // sortBy: 'featured', // This might need custom sorting logic or a specific query
    sortBy: 'rating', // Alternative: sort by rating
    limit: 4 // Show top 4 popular experiences
  });

  // Render loading state
  if (loading && popularListings.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold text-ocean-dark">Popular Experiences</h2>
            {/* Placeholder for View All button */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => ( // Render 4 skeletons
              <Card key={i} className="overflow-hidden h-full">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 w-full"></div>
                  <CardContent className="p-4">
                    <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/2 mb-4 rounded"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
                      <div className="bg-gray-300 h-8 w-1/3 rounded"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-red-600">
          Error loading experiences: {error.message}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold text-ocean-dark">Popular Experiences</h2>
          {/* Link View All button to the market page */}
          <Link to="/market">
            <Button variant="link" className="text-ocean">View All Experiences</Button>
          </Link>
        </div>

        {popularListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Map over fetched popularListings and pass listing prop */}
            {popularListings.map((listing) => (
              <ExperienceCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          // Display message if no listings are found
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
             <Compass className="h-12 w-12 mx-auto text-gray-400 mb-4" />
             <h3 className="text-xl font-medium text-gray-800 mb-2">No popular experiences found</h3>
             <p className="text-gray-600">Check back later for exciting things to do!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
