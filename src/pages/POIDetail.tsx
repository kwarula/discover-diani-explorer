import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Palmtree, Clock, DollarSign, User, Info } from 'lucide-react';
import usePOI from '@/hooks/usePOI';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Default image if POI has no images
const DEFAULT_IMAGE = '/placeholder.svg';

const POIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: poi, isLoading, isError } = usePOI(id || '');

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !poi) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load point of interest. It may not exist or there was a server error.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Determine if we have images to show
  const hasImages = poi.images && poi.images.length > 0;

  return (
    <>
      <Helmet>
        <title>{poi.name} | Explore Zanzibar</title>
        <meta name="description" content={poi.description || `Discover ${poi.name} in Zanzibar`} />
      </Helmet>

      <div className="container mx-auto p-4 space-y-6">
        {/* POI Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{poi.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Palmtree className="mr-1 h-3 w-3" />
              {poi.category}
            </Badge>
            {poi.featured && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Carousel */}
            {hasImages ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {poi.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={image}
                          alt={`${poi.name} - Image ${index + 1}`}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <AspectRatio ratio={16 / 9}>
                <img
                  src={DEFAULT_IMAGE}
                  alt={poi.name}
                  className="rounded-lg object-cover w-full h-full bg-muted"
                />
              </AspectRatio>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About</h2>
              <p className="text-muted-foreground">{poi.description}</p>
              
              {/* History Section (if available) */}
              {poi.history && (
                <>
                  <Separator />
                  <h2 className="text-2xl font-semibold">History</h2>
                  <p className="text-muted-foreground">{poi.history}</p>
                </>
              )}
              
              {/* Significance Section (if available) */}
              {poi.significance && (
                <>
                  <Separator />
                  <h2 className="text-2xl font-semibold">Significance</h2>
                  <p className="text-muted-foreground">{poi.significance}</p>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Card */}
            <Card>
              <CardContent className="p-0">
                <AspectRatio ratio={4/3}>
                  <iframe
                    title={`Map of ${poi.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${poi.longitude-0.01},${poi.latitude-0.01},${poi.longitude+0.01},${poi.latitude+0.01}&layer=mapnik&marker=${poi.latitude},${poi.longitude}`}
                    className="rounded-t-lg"
                  />
                </AspectRatio>
                <div className="p-4">
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Latitude: {poi.latitude.toFixed(6)}<br />
                    Longitude: {poi.longitude.toFixed(6)}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                    <a 
                      href={`https://www.openstreetmap.org/?mlat=${poi.latitude}&mlon=${poi.longitude}#map=15/${poi.latitude}/${poi.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Larger Map
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Details</h3>
                
                {/* Visit Time */}
                {poi.best_visit_time && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Best Time to Visit</p>
                      <p className="text-sm text-muted-foreground">{poi.best_visit_time}</p>
                    </div>
                  </div>
                )}
                
                {/* Entrance Fee */}
                {poi.entrance_fee && (
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Entrance Fee</p>
                      <p className="text-sm text-muted-foreground">{poi.entrance_fee}</p>
                    </div>
                  </div>
                )}
                
                {/* Guide Required */}
                {poi.guide_required !== null && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Guide Required</p>
                      <p className="text-sm text-muted-foreground">
                        {poi.guide_required ? 'Yes, a guide is recommended' : 'No, self-guided visits are possible'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Access Notes */}
                {poi.access_notes && (
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Access Information</p>
                      <p className="text-sm text-muted-foreground">{poi.access_notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button variant="default" className="w-full">
                Find Nearby Accommodations
              </Button>
              <Button variant="outline" className="w-full">
                Add to Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default POIDetail;
