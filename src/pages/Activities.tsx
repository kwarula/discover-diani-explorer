import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, Clock, Users, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ActivitiesPage = () => {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    filterActivities(selectedCategories, value);
  };

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    filterActivities(updatedCategories, priceRange);
  };

  const filterActivities = (categories: string[], priceRange: number[]) => {
    let filtered = activities;
    
    // Filter by categories if any are selected
    if (categories.length > 0) {
      filtered = filtered.filter(activity => 
        categories.includes(activity.category)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(
      activity => activity.price >= priceRange[0] && activity.price <= priceRange[1]
    );
    
    setFilteredActivities(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-ocean-dark text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')"
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Diani Beach Activities
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Experience the best activities Diani has to offer - from thrilling water sports to relaxing sunset cruises and cultural tours.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Water Sports</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Boat Tours</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Wildlife</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Cultural Tours</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Family Activities</Badge>
            </div>
          </div>
        </div>
      </section>
      
      {/* Activities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold">Filters</h2>
                  <Filter size={20} className="text-gray-500" />
                </div>
                
                <div className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider 
                        defaultValue={[0, 200]} 
                        max={200} 
                        step={10}
                        onValueChange={handlePriceChange}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category.id}`} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Duration Filter */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Duration</h3>
                    <div className="space-y-2">
                      {durations.map((duration) => (
                        <div key={duration.value} className="flex items-center space-x-2">
                          <Checkbox id={`duration-${duration.value}`} />
                          <Label htmlFor={`duration-${duration.value}`}>{duration.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Group Size Filter */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Group Size</h3>
                    <div className="space-y-2">
                      {groupSizes.map((size) => (
                        <div key={size.value} className="flex items-center space-x-2">
                          <Checkbox id={`size-${size.value}`} />
                          <Label htmlFor={`size-${size.value}`}>{size.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activities List */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-display font-bold text-ocean-dark">
                    Available Activities
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({filteredActivities.length} activities)
                    </span>
                  </h2>
                  <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                      Featured
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                      Popular
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredActivities.map((activity, index) => (
                      <ActivityCard key={index} activity={activity} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="featured" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredActivities
                      .filter(activity => activity.featured)
                      .map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="popular" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredActivities
                      .filter(activity => activity.rating >= 4.7)
                      .map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-ocean-dark mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Our team can help you create a custom itinerary based on your preferences and schedule.
            Let us take care of the planning while you enjoy your vacation!
          </p>
          <Button size="lg" className="bg-coral hover:bg-coral-dark text-white">
            Contact Us For Custom Planning
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Activity Card Component
const ActivityCard = ({ activity }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-52">
        <img 
          src={activity.image} 
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        {activity.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center text-white">
            <Badge className="bg-white/20 border-none">${activity.price}</Badge>
            <span className="mx-2">•</span>
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-1" />
              <span>{activity.duration}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg text-ocean-dark">{activity.title}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{activity.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{activity.location}</span>
          {activity.groupSize && (
            <>
              <span className="mx-2">•</span>
              <Users size={14} className="mr-1" />
              <span>Up to {activity.groupSize} people</span>
            </>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
        <Button variant="outline" className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white">
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

// Sample Data
const categories = [
  { id: 'watersports', name: 'Water Sports' },
  { id: 'wildlife', name: 'Wildlife & Nature' },
  { id: 'cultural', name: 'Cultural Tours' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'relaxation', name: 'Relaxation' }
];

const durations = [
  { value: 'half-day', label: 'Half Day (1-4 hrs)' },
  { value: 'full-day', label: 'Full Day (5-8 hrs)' },
  { value: 'multi-day', label: 'Multi-Day' }
];

const groupSizes = [
  { value: 'small', label: 'Small (1-5 people)' },
  { value: 'medium', label: 'Medium (6-12 people)' },
  { value: 'large', label: 'Large (12+ people)' }
];

const activities = [
  {
    title: "Diani Reef Snorkeling Tour",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    price: 45,
    duration: "3 hours",
    rating: 4.8,
    location: "Diani Marine Reserve",
    description: "Explore vibrant coral reefs and diverse marine life in the crystal clear waters of Diani Beach.",
    featured: true,
    groupSize: 8,
    category: 'watersports'
  },
  {
    title: "Kitesurfing Lesson for Beginners",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    price: 85,
    duration: "2 hours",
    rating: 4.9,
    location: "Galu Beach",
    description: "Learn the basics of kitesurfing with professional instructors in one of Africa's best kitesurfing spots.",
    featured: false,
    groupSize: 4,
    category: 'watersports'
  },
  {
    title: "Sunset Dhow Cruise",
    image: "https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    price: 60,
    duration: "2.5 hours",
    rating: 4.7,
    location: "Diani Beach",
    description: "Sail on a traditional wooden dhow as the sun sets over the Indian Ocean. Includes refreshments and snacks.",
    featured: true,
    groupSize: 12,
    category: 'relaxation'
  },
  {
    title: "Colobus Monkey Forest Tour",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 30,
    duration: "3 hours",
    rating: 4.6,
    location: "Diani Forest",
    description: "Guided walking tour to observe the endangered Angolan Colobus monkeys in their natural habitat.",
    featured: false,
    groupSize: 10,
    category: 'wildlife'
  },
  {
    title: "Deep Sea Fishing Expedition",
    image: "https://images.unsplash.com/photo-1545508775-0fb0b48ab3af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    price: 150,
    duration: "6 hours",
    rating: 4.8,
    location: "Indian Ocean",
    description: "Full day deep sea fishing trip targeting marlin, sailfish, and tuna with experienced local fishermen.",
    featured: false,
    groupSize: 6,
    category: 'adventure'
  },
  {
    title: "Traditional Mijikenda Village Visit",
    image: "https://images.unsplash.com/photo-1591142890700-87a965e9b242?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    price: 40,
    duration: "4 hours",
    rating: 4.7,
    location: "Kinondo Village",
    description: "Immerse yourself in local culture with a visit to a traditional Mijikenda village. Learn about customs and daily life.",
    featured: true,
    groupSize: 8,
    category: 'cultural'
  },
  {
    title: "Shimba Hills Wildlife Safari",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 120,
    duration: "8 hours",
    rating: 4.5,
    location: "Shimba Hills National Reserve",
    description: "Full-day safari to spot elephants, buffalo and antelopes in Kenya's coastal national reserve.",
    featured: false,
    groupSize: 7,
    category: 'wildlife'
  },
  {
    title: "Stand Up Paddleboarding",
    image: "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 35,
    duration: "1.5 hours",
    rating: 4.6,
    location: "Diani Lagoon",
    description: "Learn to paddleboard in the calm waters of Diani Beach lagoon. Perfect for beginners and families.",
    featured: false,
    groupSize: 6,
    category: 'watersports'
  },
  {
    title: "Kaya Kinondo Sacred Forest Walk",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 25,
    duration: "2 hours",
    rating: 4.4,
    location: "Kinondo, South Diani",
    description: "Guided tour through the sacred Kaya forest with a local Mijikenda guide explaining cultural significance.",
    featured: false,
    groupSize: 10,
    category: 'cultural'
  },
  {
    title: "Diani Beach Yoga Retreat",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 20,
    duration: "1 hour",
    rating: 4.9,
    location: "Diani Beach",
    description: "Beachfront yoga session at sunrise or sunset with experienced instructors. All levels welcome.",
    featured: true,
    groupSize: 12,
    category: 'relaxation'
  },
  {
    title: "Skydiving Adventure",
    image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 200,
    duration: "3 hours",
    rating: 4.9,
    location: "Diani Beach Airstrip",
    description: "Experience the ultimate adrenaline rush with a tandem skydive over the stunning Diani coastline.",
    featured: true,
    groupSize: 2,
    category: 'adventure'
  }
];

export default ActivitiesPage;
