
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
                <RecommendationCard key={activity.id} item={activity} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>No activities found. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
              View All Activities
            </Button>
          </div>
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
                <RecommendationCard key={restaurant.id} item={restaurant} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>No dining options found. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
              View All Restaurants
            </Button>
          </div>
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
                <RecommendationCard key={hotel.id} item={hotel} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>No accommodations found. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
              View All Accommodations
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationTabs;
