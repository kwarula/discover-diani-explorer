import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/auth';
import { useListings } from '@/hooks/useListings';
import { WeatherCard, TripOverview, RecommendationTabs } from '@/components/dashboard';
import ChatAssistant from '@/components/dashboard/ChatAssistant';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { profile, isLoading: authLoading, user } = useAuth();
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

  // Display a loading state while authentication data is being loaded
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-ocean mb-2" />
        <p className="text-ocean">Loading your dashboard...</p>
      </div>
    );
  }

  // Show error state if we have a user but no profile
  if (user && !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Profile Loading Error</h2>
            <p className="mb-4">There was a problem loading your profile. This might be because your profile hasn't been fully created yet.</p>
            <div className="flex justify-center">
              <a 
                href="/profile" 
                className="inline-flex items-center px-4 py-2 bg-ocean text-white rounded-md hover:bg-ocean-dark"
              >
                Go to Profile Settings
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Weather and Welcome Section */}
          <WeatherCard 
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
      
      {/* Chat Assistant */}
      <ChatAssistant />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
