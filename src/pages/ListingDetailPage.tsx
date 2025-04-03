import React, { useState, useEffect } from 'react'; // Keep useEffect for potential other uses if needed
import { useParams, Link } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client'; // No longer needed directly
import { Tables } from '@/types/database';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { MapPin, Star, Clock, Users, Info, AlertTriangle, ArrowLeft, CheckCircle, Waves } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { supabase } from '@/integrations/supabase/client'; // Re-added supabase import
import { useAuth } from '@/contexts/auth';
import { useListing } from '@/hooks/useListings'; // Import useListing hook
import useReviews from '@/hooks/useReviews'; // Corrected default import for useReviews hook

// Type alias for review data
type ReviewData = Tables<'reviews'>;

// Define review columns string outside component (can be removed if useReviews handles selection internally)
const reviewColumns = `
    id, created_at, user_id, listing_id, operator_id, rating, comment, used_guide
`;

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get listing ID from URL
  const { user } = useAuth(); // Get authenticated user state

  // Fetch data using hooks
  // useListing hook fetches the listing and its associated reviews
  const { data: listingData, isLoading: listingLoading, error: listingError } = useListing(id);
  // useReviews hook fetches reviews separately, allowing independent loading/error/refetch
  const { reviews, loading: reviewLoading, error: reviewError, fetchReviews } = useReviews({ listingId: id });

  // Combine loading and error states (prioritize listing loading/error)
  const loading = listingLoading; // Primarily wait for the listing itself
  const error = listingError?.message || null; // Show listing error first

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Extract listing from the react-query data object
  // Note: listingData from useListing already includes reviews based on the hook's select statement
  const listing = listingData;

  // Handle Review Submission
  const handleReviewSubmit = async (values: any) => {
     if (!user || !id) {
       toast({ title: "Error", description: "You must be logged in to submit a review.", variant: "destructive" });
       return;
     }
     setIsSubmittingReview(true);
     try {
        // We still need supabase client here for the insert operation
        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                listing_id: id, // Link review to this listing
                user_id: user.id,
                rating: values.rating,
                comment: values.comment,
                used_guide: values.used_guide,
                operator_id: null // Explicitly set operator_id to null for listing reviews
            });

        if (insertError) throw insertError;

        toast({ title: "Success", description: "Your review has been submitted!" });
        // Refetch reviews using the hook's refetch function
        fetchReviews();

     } catch (err: any) {
         console.error("Error submitting review:", err);
         toast({ title: "Submission Failed", description: err.message || "Could not submit your review.", variant: "destructive" });
     } finally {
         setIsSubmittingReview(false);
     }
  };


  // --- Render Logic ---

  if (loading) {
    // Skeleton Loader remains the same
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="w-full h-96 mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    // Error Display remains the same
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Listing</h2>
          <p className="text-gray-600 mb-6">{error || "The requested listing could not be found."}</p>
          <Button asChild variant="outline">
            <Link to="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Display Listing Details ---
  const imageUrl = listing.images?.[0] || '/placeholder.svg';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/explore"> {/* Or dynamically go back */}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image & Key Info */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark">{listing.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {listing.category && <Badge variant="outline">{listing.category}</Badge>}
              {listing.sub_category && <Badge variant="secondary">{listing.sub_category}</Badge>}
              {listing.location && (
                <span className="flex items-center"><MapPin size={14} className="mr-1" /> {listing.location}</span>
              )}
              {/* Add Rating display here if available */}
            </div>

            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
              <img src={imageUrl} alt={listing.title ?? 'Listing image'} className="object-cover w-full h-full" />
            </AspectRatio>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <p>{listing.description || 'No description provided.'}</p>
            </div>

             {/* Additional Info Section */}
             <div className="space-y-4 pt-4 border-t">
                <h3 className="text-xl font-semibold">Additional Information</h3>
                {listing.guide_recommended && (
                  <div className="flex items-center text-sm p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
                    <Info size={16} className="mr-2 flex-shrink-0" />
                    <span>A guided tour is highly recommended for the best experience.</span>
                  </div>
                )}
                 {listing.tide_dependency && listing.tide_dependency !== 'none' && (
                  <div className="flex items-center text-sm p-3 bg-sky-50 border border-sky-200 rounded-md text-sky-700">
                    <Waves size={16} className="mr-2 flex-shrink-0" />
                    <span>Best experienced at: <strong className="capitalize">{listing.tide_dependency.replace('_', ' ')}</strong></span>
                  </div>
                )}
                 {listing.wildlife_notice && (
                  <div className="flex items-center text-sm p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-700">
                    <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                    <span>Wildlife Notice: {listing.wildlife_notice}</span>
                  </div>
                )}
                 {listing.transport_instructions && (
                  <div>
                    <h4 className="font-medium mb-1">Getting Here:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{listing.transport_instructions}</p>
                  </div>
                )}
             </div>

            {/* Reviews Section - Use data from useReviews hook */}
            <div className="pt-6 border-t">
              <ReviewList reviews={reviews} isLoading={reviewLoading} error={reviewError} />
            </div>

             {/* Add Review Form */}
             {user && ( // Only show form if user is logged in
                <div className="pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                    <ReviewForm
                        listingId={id} // Pass listing ID
                        userId={user.id}
                        onSubmit={handleReviewSubmit}
                        isSubmitting={isSubmittingReview}
                    />
                </div>
             )}
             {!user && (
                 <div className="pt-6 border-t text-center text-sm text-muted-foreground">
                     <Link to="/login" className="text-ocean hover:underline">Log in</Link> to leave a review.
                 </div>
             )}

          </div>

          {/* Right Column: Booking/Info Card (Placeholder) */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Details & Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {listing.price !== null && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price:</span>
                    <span className="font-semibold text-lg text-ocean">
                      ${listing.price} {listing.price_unit ? `/ ${listing.price_unit}` : ''}
                    </span>
                  </div>
                )}
                 {listing.price_range && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price Range:</span>
                    <Badge variant="outline">{listing.price_range}</Badge>
                  </div>
                )}
                {/* Add Duration, Group Size etc. if available */}
                {/* <div className="flex justify-between items-center">
                  <span className="font-medium">Duration:</span>
                  <span>{listing.duration || 'N/A'}</span>
                </div> */}
                <Button className="w-full bg-coral hover:bg-coral-dark text-white mt-4">
                  Book Now / Check Availability
                </Button>
                {/* Add contact info or link to operator profile if applicable */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListingDetailPage;
