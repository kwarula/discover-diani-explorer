import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Users, Clock, ArrowRight, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Sample itinerary data
const itineraries = [
  {
    id: '1',
    title: 'Beach Relaxation Getaway',
    days: 3,
    description: 'Perfect for couples looking for a romantic beachfront experience with sunset dinners and spa treatments.',
    image: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['couples', 'relaxation', 'romance'],
    price: 320,
    activities: [
      'Private beach dinner at sunset',
      'Couple\'s massage at a beachfront spa',
      'Sunrise yoga session',
      'Dhow cruise with champagne'
    ],
    locations: ['Diani Beach South', 'Galu Beach', 'Chale Island'],
    rating: 4.9,
    type: 'relaxation'
  },
  {
    id: '2',
    title: 'Diani Adventure Experience',
    days: 5,
    description: 'Action-packed itinerary for adventure lovers, featuring water sports, skydiving, and forest exploration.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['adventure', 'active', 'thrill-seekers'],
    price: 450,
    activities: [
      'Kitesurfing lessons',
      'Skydiving over Diani Beach',
      'Deep sea fishing expedition',
      'Mountain biking tour'
    ],
    locations: ['Diani Beach North', 'Shimba Hills', 'Tiwi Beach'],
    rating: 4.8,
    type: 'adventure'
  },
  {
    id: '3',
    title: 'Family Fun in Diani',
    days: 7,
    description: 'Kid-friendly itinerary with a mix of beach activities, wildlife experiences, and educational tours.',
    image: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['families', 'kids', 'educational'],
    price: 560,
    activities: [
      'Colobus monkey sanctuary visit',
      'Snorkeling in shallow reefs',
      'Glass-bottom boat tour',
      'Beach games and sandcastle building'
    ],
    locations: ['Diani Beach Central', 'Colobus Conservation', 'Kongo River'],
    rating: 4.7,
    type: 'family'
  },
  {
    id: '4',
    title: 'Coastal Culture Immersion',
    days: 4,
    description: 'Deep dive into local Swahili culture, traditions, cuisine, and history of the Kenyan coast.',
    image: 'https://images.unsplash.com/photo-1623857584158-23c769acb3c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['culture', 'history', 'cuisine'],
    price: 380,
    activities: [
      'Swahili cooking class',
      'Visit to local village',
      'Traditional dance performance',
      'Historic sites tour in Mombasa'
    ],
    locations: ['Diani Beach', 'Ukunda', 'Mombasa Old Town'],
    rating: 4.9,
    type: 'cultural'
  },
  {
    id: '5',
    title: 'Wildlife & Beach Combo',
    days: 6,
    description: 'The perfect blend of safari adventures and beach relaxation for the complete Kenyan experience.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['wildlife', 'nature', 'photography'],
    price: 620,
    activities: [
      'Shimba Hills safari day trip',
      'Dolphin spotting boat tour',
      'Mangrove forest exploration',
      'Birdwatching tour'
    ],
    locations: ['Diani Beach', 'Shimba Hills Reserve', 'Kisite Marine Park'],
    rating: 4.8,
    type: 'nature'
  },
  {
    id: '6',
    title: 'Budget-Friendly Diani',
    days: 5,
    description: 'Experience the best of Diani without breaking the bank with this value-focused itinerary.',
    image: 'https://images.unsplash.com/photo-1602002418082-dd4e5fd126a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    idealFor: ['budget', 'backpackers', 'value'],
    price: 240,
    activities: [
      'Public beach access spots',
      'Self-guided nature walks',
      'Local street food tour',
      'Sunset viewpoints'
    ],
    locations: ['Diani Beach Public Areas', 'Ukunda Market', 'Tiwi Beach'],
    rating: 4.6,
    type: 'budget'
  }
];

// Trip types for filtering
const tripTypes = [
  { id: 'all', label: 'All Trips' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'family', label: 'Family' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'nature', label: 'Nature & Wildlife' },
  { id: 'budget', label: 'Budget' },
];

export default function PlanYourTrip() {
  const [selectedType, setSelectedType] = useState('all');
  const [savedItineraries, setSavedItineraries] = useState<string[]>([]);
  
  // Filter itineraries by selected type
  const filteredItineraries = selectedType === 'all' 
    ? itineraries 
    : itineraries.filter(itinerary => itinerary.type === selectedType);
  
  // Toggle saved itinerary
  const toggleSaved = (id: string) => {
    if (savedItineraries.includes(id)) {
      setSavedItineraries(prev => prev.filter(item => item !== id));
    } else {
      setSavedItineraries(prev => [...prev, id]);
    }
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Plan Your <span className="text-ocean">Perfect Trip</span> to Diani
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our curated itineraries designed for different travel styles, or customize your own perfect Diani Beach experience.
          </p>
        </div>
        
        {/* Filter tabs */}
        <Tabs defaultValue="all" className="mb-10" onValueChange={setSelectedType}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100">
              {tripTypes.map(type => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id}
                  className={cn(
                    "px-4 py-2 data-[state=active]:bg-ocean data-[state=active]:text-white"
                  )}
                >
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Content for all tabs */}
          <TabsContent value={selectedType || 'all'} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => (
                <Card key={itinerary.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={itinerary.image} 
                      alt={itinerary.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                      className={cn(
                        "absolute top-3 right-3 p-2 rounded-full transition-colors duration-200",
                        savedItineraries.includes(itinerary.id) 
                          ? "bg-coral text-white" 
                          : "bg-white/80 text-gray-600 hover:bg-white"
                      )}
                      onClick={() => toggleSaved(itinerary.id)}
                      aria-label={savedItineraries.includes(itinerary.id) ? "Remove from saved" : "Save itinerary"}
                    >
                      <Heart className={cn(
                        "h-5 w-5 transition-all duration-300",
                        savedItineraries.includes(itinerary.id) && "fill-current"
                      )} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-ocean text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {itinerary.days} days
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{itinerary.title}</h3>
                      <Badge className="bg-yellow-400 text-yellow-900">
                        {itinerary.rating} ★
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {itinerary.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {itinerary.idealFor.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Locations:
                      </div>
                      <p className="text-sm text-gray-700">{itinerary.locations.join(', ')}</p>
                    </div>
                    
                    <div className="mb-5">
                      <div className="text-xs text-gray-500 mb-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Highlights:
                      </div>
                      <ul className="text-sm text-gray-700 pl-5 list-disc">
                        {itinerary.activities.slice(0, 2).map((activity, index) => (
                          <li key={index} className="line-clamp-1">{activity}</li>
                        ))}
                        {itinerary.activities.length > 2 && <li className="text-ocean">+{itinerary.activities.length - 2} more</li>}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500">Starting from</span>
                        <p className="text-xl font-bold text-ocean">${itinerary.price}</p>
                      </div>
                      
                      <Button asChild size="sm" className="bg-coral hover:bg-coral-dark text-white">
                        <Link to={`/trip/${itinerary.id}`} className="flex items-center">
                          View Plan
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Call to action for custom planning */}
        <div className="bg-gradient-to-r from-ocean to-ocean-dark rounded-xl text-white p-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Create Your Custom Diani Experience</h3>
              <p className="text-white/80 max-w-xl">
                Don't see the perfect itinerary? Work with our local experts to create a customized trip tailored to your preferences, schedule, and budget.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-ocean hover:bg-white/90 min-w-[150px]">
              <Link to="/custom-trip">
                Start Planning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 