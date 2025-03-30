
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Compass, Sun, Waves, Anchor } from "lucide-react";

const ExplorePage = () => {
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
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Explore Diani Beach
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover the stunning beaches, vibrant coral reefs, and unique cultural experiences that make Diani a tropical paradise.
            </p>
            <div className="flex flex-wrap gap-3">
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
          <Tabs defaultValue="beaches" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="beaches" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Sun className="mr-2 h-4 w-4" />
                  Beaches
                </TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Waves className="mr-2 h-4 w-4" />
                  Activities
                </TabsTrigger>
                <TabsTrigger value="attractions" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Compass className="mr-2 h-4 w-4" />
                  Attractions
                </TabsTrigger>
                <TabsTrigger value="dining" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                  <Anchor className="mr-2 h-4 w-4" />
                  Dining
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="beaches" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beachSpots.map((spot, index) => (
                  <LocationCard key={index} location={spot} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                  <LocationCard key={index} location={activity} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="attractions" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((attraction, index) => (
                  <LocationCard key={index} location={attraction} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="dining" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant, index) => (
                  <LocationCard key={index} location={restaurant} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Diani Beach Map
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the geographical layout of Diani Beach and find the perfect spots for your adventure.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 aspect-[16/9] max-w-5xl mx-auto">
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={40} className="mx-auto mb-3 text-ocean" />
                <p className="text-lg font-medium">Interactive Map Coming Soon</p>
                <p>Our team is working on an interactive map to help you navigate Diani Beach better.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Location Card Component
const LocationCard = ({ location }) => {
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

// Sample Data
const beachSpots = [
  {
    title: "Diani Main Beach",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.9,
    location: "Central Diani",
    description: "The iconic white sand beaches that made Diani famous. Perfect for swimming and sunbathing.",
    featured: true
  },
  {
    title: "Galu Beach",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    location: "South Diani",
    description: "A quieter stretch of beach with pristine sands and fewer crowds. Great for relaxation."
  },
  {
    title: "Tiwi Beach",
    image: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    rating: 4.6,
    location: "North of Diani",
    description: "A secluded beach with beautiful rock formations and tide pools. Popular with locals."
  }
];

const activities = [
  {
    title: "Snorkeling & Diving",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.8,
    location: "Diani Reef",
    description: "Explore vibrant coral reefs and diverse marine life in the crystal clear waters.",
    featured: true
  },
  {
    title: "Kitesurfing",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.9,
    location: "Galu Beach",
    description: "Perfect wind conditions make Diani one of the top kitesurfing destinations in Africa."
  },
  {
    title: "Glass Bottom Boat Tours",
    image: "https://images.unsplash.com/photo-1561738687-52807c030c55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    rating: 4.5,
    location: "Central Diani",
    description: "View the underwater world without getting wet on these popular family-friendly tours."
  }
];

const attractions = [
  {
    title: "Colobus Conservation",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.7,
    location: "Diani Beach Road",
    description: "Sanctuary for the endangered Angolan Colobus monkeys with guided tours available.",
    featured: true
  },
  {
    title: "Kaya Kinondo Sacred Forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.6,
    location: "Kinondo, South Diani",
    description: "A sacred Mijikenda forest with cultural significance and guided eco-tours."
  },
  {
    title: "Shimba Hills National Reserve",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.5,
    location: "45 minutes from Diani",
    description: "Kenya's only coastal national park featuring elephants, antelope and beautiful waterfalls."
  }
];

const restaurants = [
  {
    title: "Sails Beach Bar & Restaurant",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 4.8,
    location: "Central Diani Beach",
    description: "Beachfront dining with fresh seafood and international cuisine. Perfect for sunset cocktails.",
    featured: true
  },
  {
    title: "Ali Barbour's Cave Restaurant",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.9,
    location: "Diani Beach Road",
    description: "Unique dining experience in a natural coral cave, serving gourmet cuisine under the stars."
  },
  {
    title: "Nomad Beach Bar & Restaurant",
    image: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    rating: 4.7,
    location: "South Diani",
    description: "Casual beachfront dining with wood-fired pizzas, seafood, and relaxed atmosphere."
  }
];

export default ExplorePage;
