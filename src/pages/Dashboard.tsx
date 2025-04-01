
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CloudSun, Compass, Map, Coffee, Hotel, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/hooks/useListings';

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: activities, isLoading: activitiesLoading } = useListings('activity', 3);
  const { data: dining, isLoading: diningLoading } = useListings('service', 2);
  const { data: accommodation, isLoading: accommodationLoading } = useListings('real_estate', 2);

  // Get current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Mock weather data - would be replaced with real API
  const weatherData = {
    current: {
      temp: 28,
      condition: 'Sunny',
      icon: CloudSun,
      wind: '12 km/h',
      humidity: '68%'
    },
    forecast: [
      { day: 'Mon', temp: 29, condition: 'Sunny' },
      { day: 'Tue', temp: 27, condition: 'Partly cloudy' },
      { day: 'Wed', temp: 28, condition: 'Sunny' },
      { day: 'Thu', temp: 26, condition: 'Scattered showers' },
      { day: 'Fri', temp: 27, condition: 'Sunny' },
    ]
  };

  const RecommendationCard = ({ item }: { item: any }) => (
    <div className="relative rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <img 
        src={item.images?.[0] || "https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
        alt={item.title} 
        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
        <h3 className="text-white font-medium">{item.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <Badge variant="outline" className="text-white border-white/50 bg-white/10">
            {item.sub_category || item.category}
          </Badge>
          <div className="flex items-center text-yellow-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 h-4 mr-1"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-sm">{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="rounded-lg overflow-hidden bg-gray-100 animate-pulse h-48"></div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-ocean rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  Welcome back, {profile?.full_name || 'Friend'}!
                </h1>
                <p className="text-white/80">
                  {currentDate} • {currentTime}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="text-center">
                  <weatherData.current.icon className="w-10 h-10 mx-auto" />
                  <div className="text-2xl font-bold">{weatherData.current.temp}°C</div>
                  <div className="text-sm text-white/80">{weatherData.current.condition}</div>
                </div>
                
                <div className="hidden md:block border-l border-white/20 h-14"></div>
                
                <div className="text-sm space-y-1">
                  <div>Wind: {weatherData.current.wind}</div>
                  <div>Humidity: {weatherData.current.humidity}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trip Overview */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-ocean-dark mb-6">Your Diani Trip</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-ocean" />
                    Trip Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-ocean-dark">{profile?.stay_duration || '?'} days</p>
                  <p className="text-gray-500 text-sm">Remaining in Diani</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Compass className="w-5 h-5 mr-2 text-coral" />
                    Your Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest, i) => (
                        <Badge key={i} className="bg-coral/10 text-coral hover:bg-coral/20 border-none">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Update your profile to add interests</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Map className="w-5 h-5 mr-2 text-ocean" />
                    Explore Nearby
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <p className="text-gray-500 text-sm mb-3">Discover attractions within walking distance</p>
                  <Button className="mt-auto bg-ocean hover:bg-ocean-dark text-white">
                    Open Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recommendations */}
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
