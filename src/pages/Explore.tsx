
import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Compass, Sun, Waves, Anchor, Landmark, Loader2 } from "lucide-react"; // Added Landmark, Loader2
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Listing, PointOfInterest } from '@/types/database'; // Updated import
import PoiCard from '@/components/poi/PoiCard'; // Added
import { useListings } from '@/hooks/useListings'; // Added useListings hook
import usePois from '@/hooks/usePois'; // Corrected default import for usePois hook
import { Checkbox } from "@/components/ui/checkbox"; // Added
import { Label } from "@/components/ui/label"; // Added
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added
import { Link } from 'react-router-dom'; // Added Link for cards

const MAP_CONTAINER_STYLE = { height: '100%', width: '100%' };
// Fix: Access environment variable correctly
const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || ''; // Added fallback
const defaultCenter = { lat: -4.2833, lng: 39.5833 }; // Diani Beach center

// --- Remove Static Sample Data ---

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('beaches'); // Default tab
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // State for InfoWindow

  // State for filters
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Keep category filter for listings
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedTide, setSelectedTide] = useState<string>('all');

  // Fetch data using hooks
  // Fetch all listings initially, filtering will happen client-side based on category state
  const { data: listingsData, isLoading: listingsLoading, error: listingsError } = useListings(null, 100); // Fetch more listings
  const { pois, loading: poisLoading, error: poisError } = usePois();

  // Combine loading states and errors
  const loading = listingsLoading || poisLoading;
  const error = listingsError?.message || poisError; // Combine error messages

  // Filtered data based on state
  const filteredListings = useMemo(() => {
    // Ensure listingsData is not null or undefined before filtering
    const currentListings = listingsData || [];
    return currentListings.filter(listing => {
      if (showVerifiedOnly && !listing.is_verified) return false;
      // Filter by selected tab category (client-side)
      if (activeTab !== 'all' && activeTab !== 'poi' && listing.category?.toLowerCase() !== activeTab.toLowerCase()) return false;
      // Apply other filters
      if (selectedCategory !== 'all' && listing.category !== selectedCategory) return false; // This might be redundant if using tabs
      if (selectedPriceRange !== 'all' && listing.price_range !== selectedPriceRange) return false;
      if (selectedTide !== 'all' && listing.tide_dependency !== selectedTide) return false;
      return true;
    });
    // Update dependencies: include activeTab if filtering by it
  }, [listingsData, showVerifiedOnly, activeTab, selectedCategory, selectedPriceRange, selectedTide]);

  const filteredPois = useMemo(() => {
    // Add POI filtering if needed (e.g., by category)
    // Example: filter by selectedCategory if it applies to POIs
    // if (selectedCategory !== 'all' && poi.category !== selectedCategory) return false;
    return pois || []; // Return empty array if pois is null/undefined
  }, [pois]); // Add dependencies if filtering POIs

  // Data for the map (currently only POIs due to missing listing coords)
  const mapLocations = useMemo(() => {
    return filteredPois
      .filter(poi => poi.latitude && poi.longitude) // Ensure coords exist
      .map(poi => ({
        id: `poi-${poi.id}`, // Use the correct id type (string)
        title: poi.name, // Use name field
        description: poi.description || '', // Use description field
        coords: { lat: poi.latitude!, lng: poi.longitude! }, // Use latitude/longitude fields
        type: 'poi'
      }));
    // TODO: Add filteredListings to mapLocations if/when coordinate data is available
  }, [filteredPois]);

  if (!GOOGLE_MAPS_API_KEY) {
      return <div className="text-red-600 p-4">Error: Google Maps API Key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.</div>;
  }

  // No longer need getListingsByCategory as filtering happens in useMemo based on activeTab

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

            {/* Tabs Content */}
            {/* Tabs Content - Now directly use filteredListings */}
            {!loading && !error && (
              <>
                <TabsContent value="beaches" className="mt-6"> <ListingGrid listings={filteredListings} /> </TabsContent>
                <TabsContent value="activities" className="mt-6"> <ListingGrid listings={filteredListings} /> </TabsContent>
                <TabsContent value="attractions" className="mt-6"> <ListingGrid listings={filteredListings} /> </TabsContent>
                <TabsContent value="dining" className="mt-6"> <ListingGrid listings={filteredListings} /> </TabsContent>
                <TabsContent value="poi" className="mt-6"> <PoiGrid pois={filteredPois} /> </TabsContent>
                {/* Add Accommodation Content similarly */}
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

          <div className="bg-white rounded-lg shadow-lg p-1 aspect-[16/9] max-w-6xl mx-auto overflow-hidden">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={defaultCenter}
                zoom={13}
              >
                {/* Render markers only for POIs for now */}
                {mapLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.coords}
                    title={location.title}
                    onClick={() => setSelectedMarker(location)}
                    // TODO: Add custom icons based on type (poi, listing category)
                  />
                ))}

                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.coords}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-1 max-w-xs">
                      <h4 className="font-bold text-md mb-1">{selectedMarker.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{selectedMarker.description}</p>
                       {/* TODO: Link to POI detail page or listing detail page */}
                       <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-coral">
                         View Details
                       </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Refactored/New Helper Components ---

// Grid for displaying listings
const ListingGrid = ({ listings }: { listings: Listing[] }) => {
  if (listings.length === 0) {
    return <p className="text-center text-gray-500 py-10">No items match the current filters in this category.</p>;
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
const PoiGrid = ({ pois }: { pois: PointOfInterest[] }) => {
   if (pois.length === 0) {
    return <p className="text-center text-gray-500 py-10">No points of interest found.</p>;
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


// Refactored Location Card to work with Listing data
const ListingCard = ({ listing }: { listing: Listing }) => {
  // Use placeholder image if listing.images is null/empty
  const imageUrl = listing.images?.[0] || '/placeholder.svg';

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
