import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, Clock, Users, Filter, Loader2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/integrations/supabase/client';
// Import Database and Tables helper
import { Database, Tables } from '@/types/database';
import { Link } from 'react-router-dom';

// Define Listing type using the Tables helper
type Listing = Tables<'listings'>;

const activityCategories = [
  { id: 'watersports', name: 'Water Sports' },
  { id: 'wildlife', name: 'Wildlife & Nature' },
  { id: 'cultural', name: 'Cultural Tours' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'relaxation', name: 'Relaxation' }
];

const ActivitiesPage = () => {
  const [allActivities, setAllActivities] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const listingsColumns = `
          id, category, created_at, description, featured, guide_recommended,
          images, is_verified, location, price, price_range, price_unit, status,
          sub_category, tide_dependency, title, transport_instructions, updated_at,
          wildlife_notice
        `;
        const { data, error: dbError } = await supabase
          .from('listings')
          .select(listingsColumns)
          .eq('category', 'activity')
          .eq('status', 'active') // Added status filter
          .order('featured', { ascending: false })
          .order('title');

        console.log("Fetched Activities Raw:", { data, dbError });

        if (dbError) throw dbError;
        setAllActivities(data as unknown as Listing[] || []);
      } catch (err: any) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities. Please try again later.");
        setAllActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    const filtered = allActivities.filter(activity => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(activity.sub_category || '')) {
        return false;
      }
      if (activity.price !== null && (activity.price < priceRange[0] || activity.price > priceRange[1])) {
        return false;
      }
      return true;
    });
    console.log("Filtered Activities:", filtered);
    return filtered;
  }, [allActivities, selectedCategories, priceRange]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

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

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold">Filters</h2>
                  <Filter size={20} className="text-gray-500" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Price Range (KES)</h3>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        max={15000}
                        step={500}
                        onValueChange={handlePriceChange}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{priceRange[0]} KES</span>
                        <span>{priceRange[1]} KES</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {activityCategories.map((category) => (
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
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-ocean-light" />
                </div>
              )}
              {error && <p className="text-center text-red-600 py-20">{error}</p>}

              {!loading && !error && (
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <h2 className="text-2xl font-display font-bold text-ocean-dark">
                      Available Activities
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({filteredActivities.length} found)
                      </span>
                    </h2>
                    <TabsList className="bg-gray-100 p-1">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-ocean">
                        Featured
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="mt-6">
                    {filteredActivities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredActivities.map((activity) => (
                          <ActivityCard key={activity.id} listing={activity} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-10">No activities match the current filters.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="featured" className="mt-6">
                    {filteredActivities.filter(a => a.featured).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredActivities
                          .filter(activity => activity.featured)
                          .map((activity) => (
                            <ActivityCard key={activity.id} listing={activity} />
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-10">No featured activities match the current filters.</p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </section>

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

const ActivityCard = ({ listing }: { listing: Listing }) => {
  const imageUrl = listing.images?.[0] || '/placeholder.svg';

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <Card className="overflow-hidden group-hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-52 shrink-0">
          <img
            src={imageUrl}
            alt={listing.title ?? 'Activity image'}
            className="w-full h-full object-cover"
          />
          {listing.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-coral text-white">Featured</Badge>
            </div>
          )}
          {listing.is_verified && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-600 text-white">Verified</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center text-white">
              {listing.price !== null && (
                <Badge className="bg-white/20 border-none">${listing.price}{listing.price_unit ? `/${listing.price_unit}` : ''}</Badge>
              )}
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-semibold text-lg text-ocean-dark">{listing.title}</h3>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin size={14} className="mr-1" />
            <span>{listing.location || 'Diani Beach'}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{listing.description || 'No description available.'}</p>
          {listing.guide_recommended && (
            <div className="flex items-center text-xs text-blue-600 mb-3 p-2 bg-blue-50 rounded border border-blue-200">
              <Info size={14} className="mr-1 flex-shrink-0" />
              <span>Guided Tour Highly Recommended</span>
            </div>
          )}
          <div className="mt-auto pt-2 text-right text-sm text-ocean group-hover:underline">
            View Details &rarr;
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActivitiesPage;
