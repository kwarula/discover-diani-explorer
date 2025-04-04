
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, MapPin, Calendar, Clock, DollarSign, Star, MessageCircle, AlertTriangle, Compass, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useListing } from '@/hooks/useListings';
import { Listing } from '@/types/database';
import { formatDate } from '@/lib/utils';
import useReviews from '@/hooks/useReviews';
import ReviewCard from '@/components/reviews/ReviewCard';
import { useAuth } from '@/contexts/auth';
import ReviewForm from '@/components/reviews/ReviewForm';
import ImageGallery from '@/components/ImageGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListing(id);
  const { reviews, loading: reviewsLoading } = useReviews({ listingId: id });
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-[200px] w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message || "Failed to load listing details. The listing may have been removed or is unavailable."}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link to="/explore">
              <Button variant="outline">Back to Explore</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Determine if the listing has images
  const hasImages = listing.images && listing.images.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section with Main Image or Gallery */}
      <section className="relative pt-20 bg-ocean-light">
        <div className="container mx-auto px-4">
          {hasImages ? (
            <div className="rounded-lg overflow-hidden shadow-lg max-h-[500px]">
              <ImageGallery images={listing.images} />
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-display font-bold text-ocean-dark">{listing.title}</h1>
                {listing.featured && (
                  <Badge className="bg-coral text-white">Featured</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {listing.category && (
                  <Badge variant="outline" className="bg-gray-100">
                    {listing.category}
                  </Badge>
                )}
                {listing.sub_category && (
                  <Badge variant="outline" className="bg-gray-100">
                    {listing.sub_category}
                  </Badge>
                )}
                {listing.is_verified && (
                  <Badge className="bg-blue-600 text-white">Verified</Badge>
                )}
                {listing.tide_dependency && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                    <Waves className="h-3 w-3" />
                    {listing.tide_dependency.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>

              {/* Location */}
              {listing.location && (
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-ocean" />
                  <span>{listing.location}</span>
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700">{listing.description || "No description available."}</p>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                {/* Tide Information */}
                {listing.tide_dependency && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-2">
                      <Waves className="h-5 w-5 mr-2" />
                      Tide Information
                    </h3>
                    <p className="text-blue-700">
                      {listing.tide_dependency === 'low_tide_best' && "This activity is best experienced during low tide."}
                      {listing.tide_dependency === 'high_tide_accessible' && "This location is more accessible during high tide."}
                      {listing.tide_dependency === 'none' && "This activity is not dependent on tides."}
                    </p>
                  </div>
                )}

                {/* Wildlife Notice */}
                {listing.wildlife_notice && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-semibold text-amber-800 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Wildlife Notice
                    </h3>
                    <p className="text-amber-700">{listing.wildlife_notice}</p>
                  </div>
                )}

                {/* Transport Instructions */}
                {listing.transport_instructions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                      <Compass className="h-5 w-5 mr-2" />
                      Getting There
                    </h3>
                    <p className="text-gray-700">{listing.transport_instructions}</p>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-semibold">Reviews</h2>
                  {user && !showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                  )}
                </div>

                {showReviewForm && (
                  <div className="mb-8">
                    <ReviewForm 
                      listingId={id || ''} 
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[120px] w-full" />
                    <Skeleton className="h-[120px] w-full" />
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Price Information */}
                  {(listing.price || listing.price_range) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <DollarSign className="h-5 w-5 mr-1 text-ocean" />
                        Pricing
                      </h3>
                      {listing.price && (
                        <p className="text-2xl font-bold text-ocean-dark">
                          ${listing.price} <span className="text-sm font-normal text-gray-500">{listing.price_unit || ''}</span>
                        </p>
                      )}
                      {listing.price_range && !listing.price && (
                        <p className="text-xl font-semibold">
                          {listing.price_range}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rating Summary */}
                  {averageRating && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Star className="h-5 w-5 mr-1 text-yellow-500" />
                        Rating
                      </h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-ocean-dark mr-2">{averageRating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.round(Number(averageRating)) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({reviews?.length || 0} reviews)</span>
                      </div>
                    </div>
                  )}

                  {/* Guide Recommendation */}
                  {listing.guide_recommended !== null && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Guide Recommendation</h3>
                      <p className={`${listing.guide_recommended ? 'text-amber-600' : 'text-green-600'}`}>
                        {listing.guide_recommended 
                          ? 'A local guide is recommended for this activity' 
                          : 'This activity can be enjoyed without a guide'}
                      </p>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="space-y-3">
                    <Button className="w-full">Book Now</Button>
                    <Button variant="outline" className="w-full">Contact Provider</Button>
                  </div>

                  {/* Listing Metadata */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    <p>Listed: {formatDate(listing.created_at)}</p>
                    {listing.updated_at !== listing.created_at && (
                      <p>Last updated: {formatDate(listing.updated_at)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ListingDetailPage;
