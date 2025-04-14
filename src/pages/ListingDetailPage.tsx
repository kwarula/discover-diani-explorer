import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database'; // Import the main Database type
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Keep CardContent
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Tag, Info, Building, MessageSquare, Edit, Map, Share2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import ReviewList from '@/components/reviews/ReviewList'; // Keep ReviewList import
import ReviewForm, { ReviewFormValues } from '@/components/reviews/ReviewForm';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import InteractiveMap from '@/components/map/InteractiveMap';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// --- Type Definitions (Simplified State) ---
type ListingRow = Database['public']['Tables']['listings']['Row'];
type OperatorRow = Database['public']['Tables']['operators']['Row']; // Define OperatorRow
type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Simpler listing type for the reverted hook
interface BaseMarketListing extends ListingRow {
  average_rating: number;
}

// Keep ReviewWithProfile definition for ReviewList component prop type
type ProfileData = Pick<ProfileRow, 'username' | 'avatar_url'>;
export interface ReviewWithProfile extends ReviewRow { profiles: ProfileData | null; }

// Keep OperatorData definition for the separate state
type OperatorData = Pick<OperatorRow, 'id' | 'business_name' | 'logo_url' | 'contact_email'>;
type Coordinates = { lat: number; lng: number };

// --- Hook: useListingDetails (Reverted Logic) ---
const useListingDetails = (listingId: string | undefined) => {
  const [listing, setListing] = useState<BaseMarketListing | null>(null); // Use simplified type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!listingId) { setError(new Error('No listing ID provided')); setLoading(false); return; }
    setError(null);
    try {
      setLoading(true);
      // Fetch listing and only review ratings for average calculation
      const { data, error: queryError } = await supabase
        .from('listings')
        .select(`*, reviews ( rating )`) // Only fetch rating from reviews
        .eq('id', listingId)
        .eq('status', 'active')
        .maybeSingle(); // Use maybeSingle

      if (queryError) throw queryError;
      if (!data) throw new Error('Listing not found.');

      // Calculate average rating
      const reviews = (data.reviews as { rating: number }[] | null) || [];
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average_rating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews: _, ...listingData } = data; // Exclude raw reviews

      // Construct the simplified listing object
      const finalListing: BaseMarketListing = {
        ...(listingData as ListingRow),
        average_rating,
      };
      setListing(finalListing);

    } catch (err: any) {
      console.error("Error fetching listing details:", err);
      const message = err.message || 'An unknown error occurred';
      const errorObject = new Error(message.includes('Listing not found') ? 'Listing not found or is inactive.' : message);
      setError(errorObject);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);
  const refetch = fetchDetails;
  // Return simplified data structure for now
  return { listing, loading, error, refetch };
};

// --- Utility Functions ---
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Date not available';
  try { const date = new Date(dateString); if (isNaN(date.getTime())) return 'Invalid Date'; return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch (e) { console.error("Error formatting date:", e); return 'Invalid Date'; }
};

// --- Component: MarketListingDetailPage ---
const MarketListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  // Use the simplified hook result for now
  const { listing, loading, error, refetch } = useListingDetails(id);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [listingCoordinates, setListingCoordinates] = useState<Coordinates | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // State to hold separately fetched reviews and operator
  const [detailedReviews, setDetailedReviews] = useState<ReviewWithProfile[]>([]);
  const [operatorInfo, setOperatorInfo] = useState<OperatorData | null>(null);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false); // Loading state for extra data

  // --- Fetch Extra Details (Reviews with Profiles, Operator) ---
  useEffect(() => {
    const fetchExtraData = async () => {
      if (!id || !listing?.user_id) return; // Need listing ID and user ID from listing

      setIsLoadingExtra(true);
      try {
        // Fetch Reviews with Profiles
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`*, profiles ( username, avatar_url )`)
          .eq('listing_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) console.warn("Could not fetch detailed reviews:", reviewsError);

        const processedReviews = ((reviewsData || []) as any[])
           .map(review => ({
             ...review,
             profiles: (review.profiles && typeof review.profiles === 'object') ? review.profiles : null,
           } as ReviewWithProfile));
        setDetailedReviews(processedReviews);

        // Fetch Operator
        const { data: operatorResult, error: operatorError } = await supabase
          .from('operators')
          .select('id, business_name, logo_url, contact_email')
          .eq('user_id', listing.user_id)
          .maybeSingle();

        if (operatorError) console.warn(`Could not fetch operator for user ${listing.user_id}:`, operatorError);
        else if (operatorResult) setOperatorInfo(operatorResult);

      } catch (err) {
        console.error("Error fetching extra details:", err);
        // Optionally show a toast for extra data fetch failure
      } finally {
        setIsLoadingExtra(false);
      }
    };

    if (listing) { // Only fetch extra data once the base listing is loaded
      fetchExtraData();
    }
  }, [id, listing]); // Depend on listing being loaded

  // --- Review Submission Handler ---
  const handleReviewSubmit = async (values: ReviewFormValues) => {
    if (!user || !id) { toast({ variant: "destructive", title: "Error", description: "You must be logged in." }); return; }
    setIsSubmittingReview(true);
    try {
      const { error: insertError } = await supabase.from('reviews').insert({ listing_id: id, user_id: user.id, rating: values.rating, comment: values.comment || null, used_guide: values.used_guide || false, });
      if (insertError) throw insertError;
      toast({ title: "Success", description: "Review submitted!" });
      setIsReviewDialogOpen(false);
      refetch(); // Refetch base listing (which might trigger extra data refetch via useEffect)
    } catch (err: any) { console.error("Error submitting review:", err); toast({ variant: "destructive", title: "Submission Failed", description: err.message || "Could not submit review." }); }
    finally { setIsSubmittingReview(false); }
  };

  // --- Contact Vendor Submission Handler ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use operatorInfo state for email
    if (!user || !operatorInfo?.contact_email || !contactSubject || !contactMessage) { toast({ variant: "destructive", title: "Error", description: "Missing information." }); return; }
    setIsSendingMessage(true);
    try {
      const emailArgs = { to: operatorInfo.contact_email, subject: `Inquiry about "${listing?.title || 'listing'}": ${contactSubject}`, text: `Message from ${user.email} regarding listing "${listing?.title || id}":\n\n${contactMessage}`, replyTo: [user.email] };
      // *** INTENTION TO CALL MCP TOOL ***
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate success
      toast({ title: "Success", description: "Message sent." });
      setIsContactDialogOpen(false); setContactSubject(''); setContactMessage('');
    } catch (err: any) { console.error("Error sending contact email:", err); toast({ variant: "destructive", title: "Failed to Send", description: err.message || "Could not send message." }); }
    finally { setIsSendingMessage(false); }
  };

  // --- Effect for Geocoding ---
  useEffect(() => {
    // (Implementation remains the same)
    if (listing?.location && !listingCoordinates && !isGeocoding) {
      const geocodeAddress = async () => {
        setIsGeocoding(true);
        console.log(`Geocoding address: ${listing.location}`);
        try {
          // *** INTENTION TO CALL MCP TOOL ***
          console.log("MCP Geocoding call initiated for:", listing.location);
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (geoError: any) { console.error("Error initiating geocoding:", geoError); toast({ variant: "destructive", title: "Map Error", description: `Could not initiate geocoding: ${geoError.message}` }); setIsGeocoding(false); }
      };
      geocodeAddress();
    }
  }, [listing?.location, listingCoordinates, isGeocoding, toast]);

  // --- Render Content ---
  const renderContent = () => {
    // Loading State
    if (loading && !listing) { /* Skeleton remains the same */
      return ( <div className="container mx-auto px-4 py-12"> {/* Skeleton Loader */} <Skeleton className="h-8 w-3/4 mb-4" /> <Skeleton className="h-6 w-1/2 mb-6" /> <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> <div className="md:col-span-2"> <Skeleton className="h-96 w-full mb-6" /> <Skeleton className="h-4 w-full mb-2" /> <Skeleton className="h-4 w-full mb-2" /> <Skeleton className="h-4 w-5/6 mb-2" /> <div className="mt-12 pt-8 border-t"> <Skeleton className="h-6 w-1/4 mb-6" /> <Skeleton className="h-64 w-full rounded-lg" /> </div> <div className="mt-12 pt-8 border-t"> <Skeleton className="h-6 w-1/4 mb-6" /> <Skeleton className="h-20 w-full mb-4" /> <Skeleton className="h-20 w-full mb-4" /> </div> </div> <div> <Card className="sticky top-24 shadow-lg"> <CardContent className="p-6 space-y-4"> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Separator /> <div className="flex items-center space-x-3"> <Skeleton className="h-12 w-12 rounded-full" /> <div className="space-y-2"> <Skeleton className="h-4 w-[150px]" /> <Skeleton className="h-4 w-[100px]" /> </div> </div> </CardContent> </Card> </div> </div> </div> ); }
    // Error State
    if (error) { return <p className="text-red-500 text-center py-12">Error: {error.message}</p>; }
    // No Listing State
    if (!listing) { return <p className="text-gray-500 text-center py-12">Listing details could not be loaded or listing not found.</p>; }

    // Success State
    const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg';
    const displayType = listing.category === 'property' ? listing.sub_category || 'Property' : listing.category;
    const operator = operatorInfo; // Use operatorInfo state
    const shareUrl = window.location.href;
    const shareTitle = `Check out this listing: ${listing.title}`;
    const mapLocation = listingCoordinates ? [{ id: listing.id, name: listing.title, lat: listingCoordinates.lat, lng: listingCoordinates.lng, type: listing.category || 'default', description: listing.location || '', image: imageUrl }] : [];

    return (
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-sm">
            {/* Use listing.average_rating and detailedReviews.length */}
            {listing.average_rating > 0 && ( <div className="flex items-center"> <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" /> <span>{listing.average_rating.toFixed(1)} ({detailedReviews.length} reviews)</span> </div> )}
            {listing.location && ( <div className="flex items-center"> <MapPin size={14} className="mr-1" /> <span>{listing.location}</span> </div> )}
            {displayType && ( <div className="flex items-center"> <Tag size={14} className="mr-1" /> <span>{displayType}</span> </div> )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Image Carousel */}
            {listing.images && listing.images.length > 0 ? ( <Carousel className="w-full rounded-lg overflow-hidden shadow-md"> <CarouselContent> {listing.images.map((imgUrl, index) => ( <CarouselItem key={index}> <img src={imgUrl} alt={`${listing.title} - Image ${index + 1}`} className="w-full h-auto max-h-[500px] object-cover" onError={(e) => (e.currentTarget.src = '/placeholder.svg')} /> </CarouselItem> ))} </CarouselContent> {listing.images.length > 1 && ( <> <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-none" /> <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-none" /> </> )} </Carousel> ) : ( <img src={imageUrl} alt={listing.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md" onError={(e) => (e.currentTarget.src = '/placeholder.svg')} /> )}

            {/* Description & Sharing */}
            <div>
              <div className="flex justify-between items-start mb-3">
                 <h2 className="text-2xl font-semibold">Description</h2>
                 <div className="flex items-center space-x-2"> <span className="text-sm text-muted-foreground">Share:</span> <FacebookShareButton url={shareUrl} title={shareTitle}> <FacebookIcon size={24} round /> </FacebookShareButton> <TwitterShareButton url={shareUrl} title={shareTitle}> <TwitterIcon size={24} round /> </TwitterShareButton> <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: "> <WhatsappIcon size={24} round /> </WhatsappShareButton> <EmailShareButton url={shareUrl} subject={shareTitle} body={`Check out this listing: ${shareUrl}`}> <EmailIcon size={24} round /> </EmailShareButton> </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description || 'No description provided.'}</p>
            </div>

            {/* Map Section */}
            {listing.location && ( <div className="pt-8 border-t"> <h2 className="text-2xl font-semibold mb-4">Location</h2> {isGeocoding && <Skeleton className="h-64 w-full rounded-lg" />} {!isGeocoding && listingCoordinates && ( <div className="h-64 md:h-80"> <InteractiveMap locations={mapLocation} initialCenter={listingCoordinates} zoom={15} height="100%" /> </div> )} {!isGeocoding && !listingCoordinates && ( <p className="text-muted-foreground">Could not display map.</p> )} <p className="text-sm text-muted-foreground mt-2">{listing.location}</p> </div> )}

            {/* Reviews Section */}
            <div className="pt-8 border-t">
              <div className="flex justify-between items-center mb-4">
                 {/* Use detailedReviews.length */}
                 <h2 className="text-2xl font-semibold">Reviews ({detailedReviews.length})</h2>
                 {user && ( <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}> <DialogTrigger asChild> <Button variant="outline"> <Edit className="mr-2 h-4 w-4" /> Write a Review </Button> </DialogTrigger> <DialogContent className="sm:max-w-[425px]"> <DialogHeader> <DialogTitle>Review {listing.title}</DialogTitle> <DialogDescription> Share your experience. </DialogDescription> </DialogHeader> <ReviewForm listingId={id} userId={user.id} onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} /> </DialogContent> </Dialog> )}
              </div>
              {/* Pass detailedReviews and isLoadingExtra */}
              <ReviewList reviews={detailedReviews} isLoading={isLoadingExtra} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <p className="text-2xl font-bold text-ocean-dark"> {listing.price !== null && listing.price !== undefined ? `$${listing.price.toLocaleString()}` : 'Price not available'} {listing.price_unit && ` ${listing.price_unit}`} </p>
                {/* Use operatorInfo state */}
                {operator?.contact_email && user && ( <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}> <DialogTrigger asChild> <Button className="w-full bg-coral hover:bg-coral-dark text-white"> <MessageSquare className="mr-2 h-4 w-4" /> Contact Vendor </Button> </DialogTrigger> <DialogContent className="sm:max-w-[425px]"> <form onSubmit={handleContactSubmit}> <DialogHeader> <DialogTitle>Contact {operator.business_name || 'Vendor'}</DialogTitle> <DialogDescription> Send message regarding "{listing.title}". Your email ({user.email}) will be shared. </DialogDescription> </DialogHeader> <div className="grid gap-4 py-4"> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="subject" className="text-right"> Subject </Label> <Input id="subject" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} className="col-span-3" required /> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="message" className="text-right"> Message </Label> <Textarea id="message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="col-span-3" rows={4} required /> </div> </div> <DialogFooter> <DialogClose asChild> <Button type="button" variant="outline" disabled={isSendingMessage}> Cancel </Button> </DialogClose> <Button type="submit" disabled={isSendingMessage}> {isSendingMessage ? 'Sending...' : 'Send Message'} </Button> </DialogFooter> </form> </DialogContent> </Dialog> )}
                {/* Use operatorInfo state */}
                {operator && ( <> <Separator /> <div className="flex items-center space-x-3"> <Avatar className="h-12 w-12"> <AvatarImage src={operator.logo_url || undefined} alt={operator.business_name || 'Vendor'} /> <AvatarFallback> <Building className="h-6 w-6 text-gray-500" /> </AvatarFallback> </Avatar> <div> <p className="text-sm text-gray-500">Sold by</p> <Link to={`/operator/${operator.id}`} className="font-semibold text-ocean hover:underline"> {operator.business_name || 'Verified Vendor'} </Link> </div> </div> </> )}
              </CardContent>
            </Card>
          </div>
        </div>
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
