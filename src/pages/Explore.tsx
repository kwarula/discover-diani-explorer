import React, { useState, useMemo } from 'react'; // Added useState, useMemo
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Compass, Sun, Waves, Anchor } from "lucide-react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'; // Added imports

const MAP_CONTAINER_STYLE = { height: '100%', width: '100%' };
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: -4.2833, lng: 39.5833 }; // Diani Beach center

// --- Add Coordinates to Sample Data ---
const beachSpots = [
  {
    id: 'beach-1', // Added unique ID
    title: "Diani Main Beach",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.9,
    location: "Central Diani",
    description: "The iconic white sand beaches that made Diani famous. Perfect for swimming and sunbathing.",
    featured: true,
    coords: { lat: -4.2833, lng: 39.5833 } // Central
  },
  {
    id: 'beach-2',
    title: "Galu Beach",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    location: "South Diani",
    description: "A quieter stretch of beach with pristine sands and fewer crowds. Great for relaxation.",
    coords: { lat: -4.3150, lng: 39.5600 } // South
  },
  {
    id: 'beach-3',
    title: "Tiwi Beach",
    image: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    rating: 4.6,
    location: "North of Diani",
    description: "A secluded beach with beautiful rock formations and tide pools. Popular with locals.",
    coords: { lat: -4.2200, lng: 39.6100 } // North
  }
];

const activities = [
  {
    id: 'activity-1',
    title: "Snorkeling & Diving",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.8,
    location: "Diani Marine Reserve",
    description: "Explore vibrant coral reefs and diverse marine life in the crystal clear waters.",
    featured: true,
    coords: { lat: -4.2900, lng: 39.5900 } // Near central reef
  },
  {
    id: 'activity-2',
    title: "Kitesurfing",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.9,
    location: "Galu Beach",
    description: "Perfect wind conditions make Diani one of the top kitesurfing destinations in Africa.",
    coords: { lat: -4.3150, lng: 39.5600 } // South (Galu)
  },
  {
    id: 'activity-3',
    title: "Glass Bottom Boat Tours",
    image: "https://images.unsplash.com/photo-1561738687-52807c030c55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    rating: 4.5,
    location: "Central Diani",
    description: "View the underwater world without getting wet on these popular family-friendly tours.",
    coords: { lat: -4.2850, lng: 39.5850 } // Central
  }
];

const attractions = [
  {
    id: 'attraction-1',
    title: "Colobus Conservation",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.7,
    location: "Diani Beach Road",
    description: "Sanctuary for the endangered Angolan Colobus monkeys with guided tours available.",
    featured: true,
    coords: { lat: -4.2700, lng: 39.5800 } // Approx location
  },
  {
    id: 'attraction-2',
    title: "Kaya Kinondo Sacred Forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.6,
    location: "Kinondo, South Diani",
    description: "A sacred Mijikenda forest with cultural significance and guided eco-tours.",
    coords: { lat: -4.3400, lng: 39.5450 } // South, inland slightly
  },
  {
    id: 'attraction-3',
    title: "Shimba Hills National Reserve",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.5,
    location: "45 minutes from Diani",
    description: "Kenya's only coastal national park featuring elephants, antelope and beautiful waterfalls.",
    coords: { lat: -4.2400, lng: 39.4200 } // West inland
  }
];

const restaurants = [
  {
    id: 'restaurant-1',
    title: "Sails Beach Bar & Restaurant",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.8,
    location: "Central Diani Beach",
    description: "Beachfront dining with fresh seafood and international cuisine. Perfect for sunset cocktails.",
    featured: true,
    coords: { lat: -4.2880, lng: 39.5820 } // Central beachfront
  },
  {
    id: 'restaurant-2',
    title: "Ali Barbour's Cave Restaurant",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.9,
    location: "Diani Beach Road",
    description: "Unique dining experience in a natural coral cave, serving gourmet cuisine under the stars.",
    coords: { lat: -4.2750, lng: 39.5780 } // Near road
  },
  {
    id: 'restaurant-3',
    title: "Nomad Beach Bar & Restaurant",
    image: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    rating: 4.7,
    location: "South Diani",
    description: "Casual beachfront dining with wood-fired pizzas, seafood, and relaxed atmosphere.",
    coords: { lat: -4.3050, lng: 39.5680 } // South beachfront
  }
];
// --- End Data Update ---

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('beaches');
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // State for InfoWindow

  // Combine all locations for the map or filter based on tab
  const allLocations = useMemo(() => [
    ...beachSpots,
    ...activities,
    ...attractions,
    ...restaurants
  ], []);

  // Or filter based on active tab (optional, showing all might be simpler)
  const currentLocations = useMemo(() => {
    switch (activeTab) {
      case 'beaches': return beachSpots;
      case 'activities': return activities;
      case 'attractions': return attractions;
      case 'dining': return restaurants;
      default: return allLocations; // Show all if no specific tab matches
    }
  }, [activeTab, allLocations]);


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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="beaches" className="w-full" onValueChange={setActiveTab}> {/* Update activeTab state */}
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1">
                 {/* ... TabsTriggers ... */}
                 <TabsTrigger value="beaches" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Sun className="mr-2 h-4 w-4" /> Beaches </TabsTrigger>
                 <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Waves className="mr-2 h-4 w-4" /> Activities </TabsTrigger>
                 <TabsTrigger value="attractions" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Compass className="mr-2 h-4 w-4" /> Attractions </TabsTrigger>
                 <TabsTrigger value="dining" className="data-[state=active]:bg-white data-[state=active]:text-ocean"> <Anchor className="mr-2 h-4 w-4" /> Dining </TabsTrigger>
              </TabsList>
            </div>

            {/* ... TabsContent for listing cards ... */}
             <TabsContent value="beaches" className="mt-6"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {beachSpots.map((spot) => ( <LocationCard key={spot.id} location={spot} /> ))} </div> </TabsContent>
             <TabsContent value="activities" className="mt-6"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {activities.map((activity) => ( <LocationCard key={activity.id} location={activity} /> ))} </div> </TabsContent>
             <TabsContent value="attractions" className="mt-6"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {attractions.map((attraction) => ( <LocationCard key={attraction.id} location={attraction} /> ))} </div> </TabsContent>
             <TabsContent value="dining" className="mt-6"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {restaurants.map((restaurant) => ( <LocationCard key={restaurant.id} location={restaurant} /> ))} </div> </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* --- Map Section --- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Diani Beach Map
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on the markers to explore attractions, restaurants, activities, and beaches in Diani.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-1 aspect-[16/9] max-w-6xl mx-auto overflow-hidden"> {/* Adjusted max-width */}
            {/* Replace placeholder with Google Map */}
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={defaultCenter}
                zoom={13} // Slightly zoomed out to see more area
              >
                {/* Render markers for the currently selected tab's locations */}
                {currentLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.coords}
                    title={location.title}
                    onClick={() => setSelectedMarker(location)} // Set selected marker on click
                  />
                ))}

                {/* Show InfoWindow when a marker is selected */}
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.coords}
                    onCloseClick={() => setSelectedMarker(null)} // Clear selection on close
                  >
                    <div className="p-1 max-w-xs">
                      <h4 className="font-bold text-md mb-1">{selectedMarker.title}</h4>
                      <p className="text-sm text-gray-600">{selectedMarker.description}</p>
                       <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-coral" onClick={() => alert(`Navigate to details for ${selectedMarker.title}`)}>
                         View Details {/* Link to detail page later */}
                       </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </section>
      {/* --- End Map Section --- */}

      <Footer />
    </div>
  );
};

// Location Card Component (remains the same)
const LocationCard = ({ location }: { location: any }) => { // Added type annotation
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={location.image}
          alt={location.title}
          className="w-full h-full object-cover"
        />
        {location.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg">{location.title}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{location.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{location.location}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{location.description}</p>
        <Button variant="outline" className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};


export default ExplorePage;
