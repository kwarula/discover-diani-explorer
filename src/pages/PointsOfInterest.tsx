import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import POICard from '@/components/POICard';
import { usePOIs } from '@/hooks/usePOI';
import { POICategory } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Landmark, 
  Building, 
  Mountain, 
  Palmtree,
  Umbrella, 
  Leaf,
  Compass,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const MAP_CONTAINER_STYLE = { height: '100%', width: '100%' };
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; // Added fallback
const defaultCenter = { lat: -4.2833, lng: 39.5833 }; // Diani Beach center

const PointsOfInterestPage = () => {
  const [activeTab, setActiveTab] = useState<POICategory | 'all'>('all');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapView, setMapView] = useState(false);
  
  const { data: allPOIs, isLoading, error } = usePOIs();
  
  const filteredPOIs = activeTab === 'all' 
    ? allPOIs 
    : allPOIs?.filter(poi => poi.category === activeTab);
  
  if (error) {
    console.error('Error loading POIs:', error);
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API Key is missing');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Points of Interest | Discover Diani</title>
      </Helmet>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-ocean text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1839&q=80')"
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Points of Interest
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover Diani's rich history, natural wonders, and cultural heritage through these carefully curated sites.
            </p>
          </div>
        </div>
      </section>

      {/* View Toggle Section */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-semibold text-gray-800">
              {isLoading ? 'Loading...' : `${filteredPOIs?.length || 0} Locations`}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant={!mapView ? "default" : "outline"} 
                size="sm"
                onClick={() => setMapView(false)}
                className={!mapView ? "bg-ocean text-white" : "text-ocean"}
              >
                <Compass className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button 
                variant={mapView ? "default" : "outline"} 
                size="sm"
                onClick={() => setMapView(true)}
                className={mapView ? "bg-ocean text-white" : "text-ocean"}
              >
                <Mountain className="h-4 w-4 mr-2" />
                Map View
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as POICategory | 'all')}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Compass className="mr-2 h-4 w-4" /> All
                </TabsTrigger>
                <TabsTrigger value="historical_site" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Landmark className="mr-2 h-4 w-4" /> Historical
                </TabsTrigger>
                <TabsTrigger value="natural_feature" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Palmtree className="mr-2 h-4 w-4" /> Natural
                </TabsTrigger>
                <TabsTrigger value="cultural_site" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Building className="mr-2 h-4 w-4" /> Cultural
                </TabsTrigger>
                <TabsTrigger value="conservation_site" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Leaf className="mr-2 h-4 w-4" /> Conservation
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content based on view mode */}
            {mapView ? (
              // Map View
              <div className="bg-white rounded-lg shadow-lg p-1 aspect-[16/9] max-w-6xl mx-auto overflow-hidden">
                {GOOGLE_MAPS_API_KEY ? (
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={MAP_CONTAINER_STYLE}
                      center={defaultCenter}
                      zoom={13}
                    >
                      {filteredPOIs?.map((poi) => (
                        <Marker
                          key={poi.id}
                          position={{ lat: poi.latitude, lng: poi.longitude }}
                          title={poi.name}
                          onClick={() => setSelectedMarker(poi)}
                        />
                      ))}

                      {selectedMarker && (
                        <InfoWindow
                          position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                          onCloseClick={() => setSelectedMarker(null)}
                        >
                          <div className="p-1 max-w-xs">
                            <h4 className="font-bold text-md mb-1">{selectedMarker.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{selectedMarker.description}</p>
                            <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-coral" asChild>
                              <a href={`/poi/${selectedMarker.id}`}>
                                View Details
                              </a>
                            </Button>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </LoadScript>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    Google Maps API key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.
                  </div>
                )}
              </div>
            ) : (
              // List View
              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-ocean" />
                  </div>
                ) : filteredPOIs && filteredPOIs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPOIs.map((poi) => (
                      <POICard key={poi.id} poi={poi} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No points of interest found for this category.
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PointsOfInterestPage;
