
import React, { useState, useMemo, useEffect, useCallback } from 'react'; // Added useCallback
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Compass, Sun, Waves, Anchor, Landmark, Loader2 } from "lucide-react";
// Corrected imports: Added Marker back, added Libraries type
import { GoogleMap, InfoWindow, Libraries } from '@react-google-maps/api'; // Removed useJsApiLoader
import { Tables } from '@/types/database';
import PoiCard from '@/components/poi/PoiCard';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext'; // Import the context hook
import { useListings } from '@/hooks/useListings';
import usePois from '@/hooks/usePois';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from 'react-router-dom'; // Added useSearchParams and Link

const MAP_CONTAINER_STYLE = { height: '100%', width: '100%' };
// Fix: Access environment variable correctly
const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '';
const defaultCenter = { lat: -4.2833, lng: 39.5833 }; // Diani Beach center

const ExplorePage = () => {
  // Remove mapLibraries definition

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('beaches');
  const [selectedPoi, setSelectedPoi] = useState<Tables<'points_of_interest'> | null>(null);

  // Consume the context hook
  const { isLoaded, loadError } = useGoogleMaps();

  // Read search parameters from URL
  const urlQuery = searchParams.get('q');
  const urlCategory = searchParams.get('category');
  const urlLocation = searchParams.get('location');

  // State for UI filters (can be used to update searchParams in the future)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedTide, setSelectedTide] = useState<string>('all');

  // Fetch data using hooks, passing URL parameters
  const { data: listingsData, isLoading: listingsLoading, error: listingsError } = useListings({
    searchQuery: urlQuery,
    category: urlCategory, // Pass category from URL
    location: urlLocation,
    limit: 100, // Fetch more listings for search results
  });
  const { pois, loading: poisLoading, error: poisError } = usePois({
    searchQuery: urlQuery,
    category: urlCategory, // Pass category from URL
    location: urlLocation,
  });

  // Combine loading states and errors
  const loading = listingsLoading || poisLoading;
  const error = listingsError?.message || poisError;

  // Data for the map (using fetched POIs directly)
  const mapLocations = useMemo(() => {
    return (pois || []) // Use fetched pois directly
      .filter(poi => poi.latitude && poi.longitude)
      .map(poi => ({
        id: `poi-${poi.id}`,
        title: poi.name,
        description: poi.description || '',
        coords: { lat: poi.latitude!, lng: poi.longitude! },
        type: 'poi',
        // Include the full POI object for the InfoWindow
        poiData: poi
      }));
    // TODO: Add listings to mapLocations if/when coordinate data is available
  }, [pois]);

  // Set active tab based on URL category on initial load
  useEffect(() => {
    if (urlCategory && urlCategory !== 'all') {
      // Map URL category to tab value if necessary
      const tabValue = urlCategory.toLowerCase(); // Assuming direct mapping for now
      // Check if tabValue is a valid tab trigger value before setting
      const validTabs = ['beaches', 'activities', 'attractions', 'dining', 'poi'];
      if (validTabs.includes(tabValue)) {
        setActiveTab(tabValue);
      } else {
        setActiveTab('beaches'); // Default if category doesn't match a tab
      }
    } else if (!urlCategory && urlQuery) {
       // If there's a query but no category, maybe default to 'all' or a relevant tab?
       // For now, keep the default 'beaches' or let the user change it.
    }
  }, [urlCategory, urlQuery]);

  // Map instance state and callbacks (moved outside renderMap)
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map loading state and errors
  const renderMap = useCallback(() => {
    if (loadError) {
      console.error("Google Maps API load error:", loadError);
      return <div className="text-center text-red-600 p-4">Error loading map. Please check the API key and network connection.</div>;
    }
    if (!isLoaded) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-ocean-light" /></div>;
    }

    return (
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad} // Get map instance
        onUnmount={onUnmount} // Clean up map instance
      >
        {/* Render markers using the new AdvancedPoiMarker component */}
        {map && mapLocations.map((location) => ( // Ensure map is loaded before rendering markers
          <AdvancedPoiMarker
            key={location.id}
            map={map}
            position={location.coords}
            title={location.title}
            poiData={location.poiData}
            onClick={setSelectedPoi}
          />
        ))}

        {selectedPoi && selectedPoi.latitude && selectedPoi.longitude && (
          <InfoWindow
            position={{ lat: selectedPoi.latitude, lng: selectedPoi.longitude }}
            onCloseClick={() => setSelectedPoi(null)}
            // pixelOffset={new window.google.maps.Size(0, -30)} // Adjust offset if needed
          >
            <div className="p-1 max-w-xs">
              <h4 className="font-bold text-md mb-1">{selectedPoi.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{selectedPoi.description}</p>
              <Link to={`/poi/${selectedPoi.id}`}>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-coral">
                  View Details
                </Button>
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
    // Corrected dependencies for renderMap
  }, [isLoaded, loadError, mapLocations, selectedPoi, map, onLoad, onUnmount]);


  if (!GOOGLE_MAPS_API_KEY) {
      return <div className="text-red-600 p-4">Error: Google Maps API Key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-ocean text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1839&q=80')"
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Explore Diani Beach
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover the stunning beaches, vibrant coral reefs, and unique cultural experiences that make Diani a tropical paradise.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Beaches</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Water Sports</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Wildlife</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Dining</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Accommodation</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      {/* Filtering Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <h3 className="text-lg font-semibold mr-4 shrink-0">Filter By:</h3>
            {/* Verified Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedOnlyExplore"
                checked={showVerifiedOnly}
                onCheckedChange={(checked) => setShowVerifiedOnly(Boolean(checked))}
                aria-labelledby="verifiedOnlyExploreLabel"
              />
              <Label htmlFor="verifiedOnlyExplore" id="verifiedOnlyExploreLabel" className="text-sm font-medium">
                Verified Only
              </Label>
            </div>
            {/* Category Filter (Example - adjust based on actual categories) */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beach">Beaches</SelectItem>
                <SelectItem value="activity">Activities</SelectItem>
                <SelectItem value="attraction">Attractions</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                {/* Add more categories dynamically if needed */}
              </SelectContent>
            </Select>
             {/* Price Range Filter (Example) */}
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="$">$ (Budget)</SelectItem>
                <SelectItem value="$$">$$ (Mid-range)</SelectItem>
                <SelectItem value="$$$">$$$ (Premium)</SelectItem>
              </SelectContent>
            </Select>
             {/* Tide Dependency Filter (Example) */}
             <Select value={selectedTide} onValueChange={setSelectedTide}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Tide Dependency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Tide</SelectItem>
                <SelectItem value="low_tide_best">Best at Low Tide</SelectItem>
                <SelectItem value="high_tide_accessible">Accessible High Tide</SelectItem>
                <SelectItem value="none">Not Tide Dependent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Explore Categories & Listings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="beaches" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1 flex-wrap h-auto">
                 <TabsTrigger value="beaches" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Sun className="mr-2 h-4 w-4" /> Beaches </TabsTrigger>
                 <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Waves className="mr-2 h-4 w-4" /> Activities </TabsTrigger>
                 <TabsTrigger value="attractions" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Compass className="mr-2 h-4 w-4" /> Attractions </TabsTrigger>
                 <TabsTrigger value="dining" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Anchor className="mr-2 h-4 w-4" /> Dining </TabsTrigger>
                 <TabsTrigger value="poi" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Landmark className="mr-2 h-4 w-4" /> Points of Interest </TabsTrigger>
                 {/* Add Accommodation Tab if needed */}
              </TabsList>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-ocean-light" />
              </div>
            )}
            {error && <p className="text-center text-red-600 py-20">{error}</p>}

            {/* Tabs Content - Use fetched data directly */}
            {!loading && !error && (
              <>
                {/* Pass listingsData directly, filtering is done server-side */}
                <TabsContent value="beaches" className="mt-6"> <ListingGrid listings={listingsData || []} /> </TabsContent>
                <TabsContent value="activities" className="mt-6"> <ListingGrid listings={listingsData || []} /> </TabsContent>
                <TabsContent value="attractions" className="mt-6"> <ListingGrid listings={listingsData || []} /> </TabsContent>
                <TabsContent value="dining" className="mt-6"> <ListingGrid listings={listingsData || []} /> </TabsContent>
                {/* Pass pois directly */}
                <TabsContent value="poi" className="mt-6"> <PoiGrid pois={pois || []} /> </TabsContent>
                {/* Add Accommodation Content similarly if needed */}
              </>
            )}
          </Tabs>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Explore Map
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on the markers to explore points of interest. (Listing map integration pending coordinate data).
            </p>
          </div>

          {/* Render map using the callback */}
          <div className="bg-white rounded-lg shadow-lg p-1 aspect-[16/9] max-w-6xl mx-auto overflow-hidden">
            {renderMap()}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};


// --- Advanced Marker Component ---
interface AdvancedPoiMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  title?: string;
  poiData: Tables<'points_of_interest'>;
  onClick: (poi: Tables<'points_of_interest'>) => void;
}

const AdvancedPoiMarker: React.FC<AdvancedPoiMarkerProps> = ({
  map,
  position,
  title,
  poiData,
  onClick,
}) => {
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps.marker || !map) {
      return;
    }

    // Create PinElement for customization
    const pin = new window.google.maps.marker.PinElement({
      background: '#FB8500', // Coral color
      borderColor: '#0077B6', // Ocean color
      glyphColor: '#FFFFFF',
    });

    // Create AdvancedMarkerElement instance
    const advMarker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title,
      content: pin.element, // Use PinElement as content
    });

    // Add click listener
    const clickListener = advMarker.addListener('click', () => {
      onClick(poiData);
    });

    setMarker(advMarker);

    // Cleanup function
    return () => {
      if (advMarker) {
        // Remove listener first
        window.google.maps.event.removeListener(clickListener);
        // Remove marker from map
        advMarker.map = null;
      }
      setMarker(null);
    };
    // Dependencies: Recreate marker if map, position, title, or poiData changes
  }, [map, position, title, poiData, onClick]);

  // This component doesn't render anything itself, it just manages the Google Maps object
  return null;
};


// --- Helper Components ---

// Grid for displaying listings
const ListingGrid = ({ listings }: { listings: Tables<'listings'>[] }) => { // Use Tables type
  if (listings.length === 0) {
    // Adjust message based on whether there was a search query
    const message = useSearchParams()[0].get('q')
      ? "No listings match your search criteria."
      : "No listings found in this category.";
    return <p className="text-center text-gray-500 py-10">{message}</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

// Grid for displaying POIs
const PoiGrid = ({ pois }: { pois: Tables<'points_of_interest'>[] }) => { // Use Tables type
   if (pois.length === 0) {
    // Adjust message based on whether there was a search query
    const message = useSearchParams()[0].get('q')
      ? "No points of interest match your search criteria."
      : "No points of interest found in this category.";
    return <p className="text-center text-gray-500 py-10">{message}</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pois.map((poi) => (
        // Wrap PoiCard in Link
        <Link key={poi.id} to={`/poi/${poi.id}`} className="block group">
          <PoiCard poi={poi} />
        </Link>
      ))}
    </div>
  );
};


// Listing Card Component
const ListingCard = ({ listing }: { listing: Tables<'listings'> }) => { // Use Tables type
  // Use placeholder image if listing.images is null/empty or not an array
  const imageUrl = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images[0]
    : '/placeholder.svg';

  return (
    <Link to={`/listing/${listing.id}`} className="block group"> {/* Wrap card in Link */}
      <Card className="overflow-hidden group-hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"> {/* Added h-full and flex */}
        <div className="relative h-48 shrink-0"> {/* Added shrink-0 */}
          <img
          src={imageUrl}
          alt={listing.title ?? 'Listing image'}
          className="w-full h-full object-cover"
        />
        {listing.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
         {listing.is_verified && ( // Display verified badge if applicable
           <div className="absolute top-2 left-2">
             <Badge className="bg-blue-600 text-white">Verified</Badge>
           </div>
         )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg">{listing.title}</h3>
          {/* Add rating display if available in listings table */}
          {/* <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{listing.rating}</span>
          </div> */}
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{listing.location || 'Diani Beach'}</span> {/* Use location string */}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{listing.description || 'No description available.'}</p> {/* Added flex-grow */}
        {/* Button removed as the whole card is a link */}
        {/* <Button variant="outline" className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white mt-auto">
          View Details
        </Button> */}
         <div className="mt-auto pt-2 text-right text-sm text-ocean group-hover:underline">
            View Details &rarr;
         </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default ExplorePage;
