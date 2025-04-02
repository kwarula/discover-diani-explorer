
import React from 'react';
import { CloudSun } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/auth';
import { useListings } from '@/hooks/useListings';
import { WeatherCard, TripOverview, RecommendationTabs } from '@/components/dashboard';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Weather and Welcome Section */}
          <WeatherCard 
            weatherData={weatherData} 
            currentDate={currentDate}
            currentTime={currentTime}
            userName={profile?.full_name || 'Friend'}
          />
          
          {/* Trip Overview */}
          <TripOverview profile={profile} />
          
          {/* Recommendations */}
          <RecommendationTabs 
            activities={activities}
            dining={dining}
            accommodation={accommodation}
            activitiesLoading={activitiesLoading}
            diningLoading={diningLoading}
            accommodationLoading={accommodationLoading}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
