
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePOI, getCategoryName } from '@/hooks/usePOI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  CalendarClock, 
  UserCheck, 
  History, 
  Landmark, 
  Building, 
  Mountain, 
  Palmtree, // Changed from PalmTree 
  Umbrella, 
  Leaf,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const MAP_CONTAINER_STYLE = { height: '100%', width: '100%' };
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'historical_site':
      return <Landmark className="h-5 w-5 mr-2" />;
    case 'natural_feature':
      return <Palmtree className="h-5 w-5 mr-2" />; // Changed from PalmTree to Palmtree
    case 'cultural_site':
      return <Building className="h-5 w-5 mr-2" />;
    case 'conservation_site':
      return <Leaf className="h-5 w-5 mr-2" />;
    case 'viewpoint':
      return <Mountain className="h-5 w-5 mr-2" />;
    case 'beach_area':
      return <Umbrella className="h-5 w-5 mr-2" />;
    default:
      return <MapPin className="h-5 w-5 mr-2" />;
  }
};

const POIDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: poi, isLoading, error } = usePOI(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-gray-600">Loading point of interest...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !poi) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading point of interest.</p>
            <Button asChild>
              <Link to="/points-of-interest">Back to All Points of Interest</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{poi.name} | Points of Interest | Discover Diani</title>
      </Helmet>
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/points-of-interest">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to All
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">{poi.name}</h1>
              <div className="flex items-center mt-2">
                <Badge className="bg-white flex items-center border border-gray-200">
                  {getCategoryIcon(poi.category)}
                  {getCategoryName(poi.category)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-2">
              <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                <img
                  src={poi.images && poi.images.length > 0 ? poi.images[0] : '/placeholder.svg'}
                  alt={poi.name}
                  className="w-full h-auto aspect-[16/9] object-cover"
                />
              </div>

              {/* Description and History */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-800 mb-3">About</h2>
                  <p className="text-gray-700">{poi.description}</p>
                </div>

                {poi.history && (
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-gray-800 mb-3 flex items-center">
                      <History className="h-5 w-5 mr-2 text-ocean" />
                      History
                    </h2>
                    <p className="text-gray-700">{poi.history}</p>
                  </div>
                )}

                {poi.significance && (
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-gray-800 mb-3 flex items-center">
                      <Landmark className="h-5 w-5 mr-2 text-ocean" />
                      Significance
                    </h2>
                    <p className="text-gray-700">{poi.significance}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details and Map */}
            <div>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Visitor Information</h3>
                  <div className="space-y-4">
                    {poi.entrance_fee && (
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Entrance Fee</p>
                          <p className="text-gray-600 text-sm">{poi.entrance_fee}</p>
                        </div>
                      </div>
                    )}

                    {poi.best_visit_time && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Best Time to Visit</p>
                          <p className="text-gray-600 text-sm">{poi.best_visit_time}</p>
                        </div>
                      </div>
                    )}

                    {poi.guide_required && (
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Guide Required</p>
                          <p className="text-gray-600 text-sm">
                            We recommend hiring a local guide for this location
                          </p>
                        </div>
                      </div>
                    )}

                    {poi.access_notes && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Access Notes</p>
                          <p className="text-gray-600 text-sm">{poi.access_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-md h-64 mb-6">
                {GOOGLE_MAPS_API_KEY ? (
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={MAP_CONTAINER_STYLE}
                      center={{ lat: poi.latitude, lng: poi.longitude }}
                      zoom={15}
                    >
                      <Marker position={{ lat: poi.latitude, lng: poi.longitude }} title={poi.name} />
                    </GoogleMap>
                  </LoadScript>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    Google Maps API key is missing
                  </div>
                )}
              </div>

              {/* Suggested Tours */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-ocean" />
                    Suggested Tours
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore this location with an experienced guide:
                  </p>
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/market?category=tours">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Find Available Tours
                      </Link>
                    </Button>
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

export default POIDetailPage;
