import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { MarketListing } from '@/hooks/useMarketListings'; // Reuse type for now
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { Card, CardContent } from '@/components/ui/card'; // Import Card and CardContent
import { MapPin, Star, Tag, Info } from 'lucide-react'; // Add relevant icons

// Hook to fetch details for a single listing
const useListingDetails = (listingId: string | undefined) => {
  const [listing, setListing] = useState<MarketListing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!listingId) {
      setError(new Error('No listing ID provided'));
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch listing including average rating calculation (similar to useMarketListings)
        const { data, error: queryError } = await supabase
          .from('listings')
          .select(`
            *, 
            reviews ( rating )
          `)
          .eq('id', listingId)
          .eq('status', 'active') // Ensure it's active
          .single(); // Expect only one result

        if (queryError) {
          // Handle case where listing is not found or other errors
          if (queryError.code === 'PGRST116') { // PostgREST code for "Resource Not Found"
             throw new Error('Listing not found.');
          }
          throw queryError;
        }

        if (data) {
           // Calculate average rating
           const reviews = (data.reviews as unknown as { rating: number }[]) || [];
           const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
           const average_rating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           const { reviews: _, ...listingData } = data;
           
           setListing({
             ...(listingData as MarketListing), // Cast to ensure type match
             average_rating,
           });
        } else {
           // Should be caught by .single() error handling, but good practice
           throw new Error('Listing not found.');
        }

      } catch (err) {
        console.error("Error fetching listing details:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [listingId]);

  return { listing, loading, error };
};

// Add the formatDate utility function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Ensure ReviewForm props are properly typed
interface ReviewFormProps {
  listingId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MarketListingDetailPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { listing, loading, error } = useListingDetails(listingId);

  // --- Render Content ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
            </div>
            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-4" />
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 text-center py-12">Error: {error.message}</p>;
    }

    if (!listing) {
      // This case should ideally be covered by the error state from the hook
      return <p className="text-gray-500 text-center py-12">Listing details could not be loaded.</p>;
    }

    // Display Listing Details
    const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg';
    const displayType = listing.category === 'property' ? listing.sub_category || 'Property' : listing.category;

    return (
      <div className="container mx-auto px-4 py-12">
        {/* Header: Title, Rating, Location */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-sm">
            {listing.average_rating !== undefined && listing.average_rating > 0 && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{listing.average_rating.toFixed(1)}</span>
              </div>
            )}
            {listing.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>{listing.location}</span>
              </div>
            )}
             {displayType && (
              <div className="flex items-center">
                <Tag size={14} className="mr-1" />
                <span>{displayType}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content: Image & Description */}
          <div className="md:col-span-2">
            <img 
              src={imageUrl} 
              alt={listing.title} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mb-6"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')} 
            />
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {listing.description || 'No description provided.'}
            </p>
            {/* TODO: Add more sections like features, amenities etc. based on schema */}
          </div>

          {/* Sidebar: Price, Contact/Booking */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 shadow-lg"> {/* Make card sticky */}
              <CardContent className="p-6">
                <p className="text-2xl font-bold text-ocean-dark mb-4">
                  {listing.price !== null && listing.price !== undefined 
                    ? `$${listing.price.toLocaleString()}` 
                    : 'Price not available'}
                  {listing.price_unit && ` ${listing.price_unit}`}
                </p>
                {/* TODO: Add contact/booking button or info */}
                <Button className="w-full bg-coral hover:bg-coral-dark text-white">
                  Contact Vendor / Book Now (Placeholder)
                </Button>
                {/* TODO: Add vendor info link? */}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* TODO: Add Reviews Section */}
        {/* <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          </div> */}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default MarketListingDetailPage;
