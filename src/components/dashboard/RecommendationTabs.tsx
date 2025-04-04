
import React from 'react';
import { Compass, Coffee, Hotel } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import RecommendationCard from './RecommendationCard';
import LoadingCard from './LoadingCard';
import { Listing } from '@/types/database';

interface RecommendationTabsProps {
  activities: Listing[] | undefined;
  dining: Listing[] | undefined;
  accommodation: Listing[] | undefined;
  activitiesLoading: boolean;
  diningLoading: boolean;
  accommodationLoading: boolean;
}

const RecommendationTabs = ({
  activities,
  dining,
  accommodation,
  activitiesLoading,
  diningLoading,
  accommodationLoading,
}: RecommendationTabsProps) => {
  // Handler for card selection
  const handleCardSelect = (id: string) => {
    console.log(`Selected listing with ID: ${id}`);
    // Implement navigation or detail view logic here
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-ocean-dark mb-6">Recommended for You</h2>
      
      <Tabs defaultValue="activities">
        <TabsList className="mb-6">
          <TabsTrigger value="activities" className="flex items-center">
            <Compass className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="dining" className="flex items-center">
            <Coffee className="w-4 h-4 mr-2" />
            Dining
          </TabsTrigger>
          <TabsTrigger value="accommodation" className="flex items-center">
            <Hotel className="w-4 h-4 mr-2" />
            Accommodation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activitiesLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : activities && activities.length > 0 ? (
              activities.map(activity => (
                <RecommendationCard 
                  key={activity.id} 
                  listing={activity} 
                  onSelect={handleCardSelect}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                <p>No personalized activities found yet.</p>
                <p className="text-sm">Explore popular options or update your interests!</p> 
                {/* Ideally, show popular items here */}
              </div>
            )}
          </div>
          {/* Only show View All if there are activities */}
          {activities && activities.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
                View All Activities
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dining" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diningLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
              </>
            ) : dining && dining.length > 0 ? (
              dining.map(restaurant => (
                <RecommendationCard 
                  key={restaurant.id} 
                  listing={restaurant} 
                  onSelect={handleCardSelect}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                <p>No personalized dining found yet.</p>
                <p className="text-sm">Explore popular options or update your interests!</p>
                {/* Ideally, show popular items here */}
              </div>
            )}
          </div>
          {/* Only show View All if there are dining options */}
          {dining && dining.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
                View All Restaurants
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="accommodation" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accommodationLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
              </>
            ) : accommodation && accommodation.length > 0 ? (
              accommodation.map(hotel => (
                <RecommendationCard 
                  key={hotel.id} 
                  listing={hotel} 
                  onSelect={handleCardSelect}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                <p>No personalized accommodation found yet.</p>
                <p className="text-sm">Explore popular options or update your interests!</p>
                {/* Ideally, show popular items here */}
              </div>
            )}
          </div>
          {/* Only show View All if there are accommodations */}
          {accommodation && accommodation.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
                View All Accommodations
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationTabs;
