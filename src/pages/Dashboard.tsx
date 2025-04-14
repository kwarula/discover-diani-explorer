import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/auth';
import { useListings } from '@/hooks/useListings'; // Keep for dining/accommodation
import usePois from '@/hooks/usePois'; // Import usePois for activities
import { WeatherCard, TripOverview, RecommendationTabs } from '@/components/dashboard';
import ChatAssistant from '@/components/dashboard/ChatAssistant';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database'; // Import Tables type

const Dashboard = () => {
  const { profile, isLoading: authLoading, user } = useAuth();

  // Get current time for POI filtering
  const now = new Date();
  const currentTimeForHook = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // HH:MM:SS format

  // Fetch time-aware activities using usePois
  // Note: We might need to limit results client-side or adjust the RPC function later
  const { pois: activities, loading: activitiesLoading, error: activitiesError } = usePois({
    currentTime: currentTimeForHook,
    // requiredTags: ['nightlife'] // Example: Uncomment to filter for nightlife
  });

  // Fetch dining and accommodation using useListings (assuming these don't need time-awareness for now)
  const { data: dining, isLoading: diningLoading } = useListings({ category: 'service', limit: 2 }); // Assuming 'service' maps to dining
  const { data: accommodation, isLoading: accommodationLoading } = useListings({ category: 'real_estate', limit: 2 }); // Assuming 'real_estate' maps to accommodation

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  // Map POIs to the structure expected by RecommendationCard
  const mappedActivities = activities?.map(poi => ({
    id: poi.id, // bigint needs to be string? Check RecommendationCard usage. Assuming string for now.
    title: poi.name, // Map name to title
    description: poi.description,
    images: poi.image_urls, // Map image_urls to images
    location: undefined, // POI doesn't have a simple location string
    // Add other required Listing fields with default/null values if necessary
    // Based on RecommendationCard, only the above are strictly needed.
    // We might need to satisfy the full Listing type for RecommendationTabs prop type.
    // Let's add defaults for fields potentially checked by Listing type itself.
    category: poi.category ?? 'activity', // Use POI category or default
    sub_category: '', // Default
    price: null, // Default
    price_unit: null, // Default
    price_range: null, // Default
    featured: false, // Default
    is_verified: false, // Default
    guide_recommended: false, // Default
    tide_dependency: null, // Default
    status: 'approved', // Default
    operator_id: null, // Default
    user_id: null, // Default
    created_at: poi.created_at, // Use POI created_at
    updated_at: null, // Default
    contact_info: null, // Default
    website: null, // Default
    amenities: null, // Default
    suitability: null, // Default
    safety_notes: null, // Default
    booking_info: null, // Default
    duration: null, // Default
    capacity: null, // Default
    wildlife_notice: null, // Default
  })) || [];


  // Use a timeout to prevent infinite loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (authLoading) {
      timeout = setTimeout(() => {
        setLoadingTimedOut(true);
      }, 10000); // 10 seconds timeout
    } else {
      setLoadingTimedOut(false);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [authLoading]);

  // Try to load profile directly if auth isn't loading but profile is missing
  useEffect(() => {
    const fetchProfileDirectly = async () => {
      if (user && !profile && !authLoading && !isLoadingProfile) {
        try {
          setIsLoadingProfile(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setLocalProfile(data);
          }
        } catch (err) {
          console.error('Error fetching profile directly:', err);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };
    
    fetchProfileDirectly();
  }, [user, profile, authLoading, isLoadingProfile]);

  // Get display time and date
  // const now = new Date(); // 'now' is already defined above
  const displayTime = now.toLocaleTimeString('en-US', {
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

  // Force refresh the page
  const handleForceRefresh = () => {
    window.location.reload();
  };

  // Create profile if missing
  const handleCreateProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoadingProfile(true);
      toast.info('Creating your profile...');
      
      // Insert basic profile
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || 'New User',
          role: 'user',
          status: 'active'
        }]);
        
      if (error) {
        throw error;
      }
      
      toast.success('Profile created successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      console.error('Failed to create profile:', err);
      toast.error(err.message || 'Failed to create profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Display a loading state while authentication data is being loaded
  if (authLoading && !loadingTimedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-ocean mb-2" />
        <p className="text-ocean">Loading your dashboard...</p>
      </div>
    );
  }

  // Show auth loading timeout screen
  if (authLoading && loadingTimedOut) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-amber-600 mb-4">Taking Longer Than Expected</h2>
            <p className="mb-4">We're having trouble loading your dashboard data. You can wait a bit longer or try refreshing the page.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleForceRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button onClick={() => window.location.href = '/auth/debug'} variant="default">
                Troubleshoot
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if we have a user but no profile
  if (user && !profile && !localProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Profile Loading Error</h2>
            <p className="mb-4">There was a problem loading your profile. This might be because your profile hasn't been fully created yet.</p>
            <div className="flex justify-center gap-3">
              <Button 
                onClick={handleCreateProfile} 
                disabled={isLoadingProfile}
                variant="default"
              >
                {isLoadingProfile && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Profile
              </Button>
              <Button 
                asChild
                variant="outline"
              >
                <a href="/profile">Go to Profile Settings</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use either the context profile or our locally fetched one
  const userProfile = profile || localProfile;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Admin Button */}
          {userProfile?.role === 'admin' && (
            <div className="mb-6 text-right"> {/* Added margin-bottom and text-right */}
              <Link to="/admin"> {/* Ensure this path is correct for your admin section */}
                <Button variant="outline">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          )}

          {/* Weather and Welcome Section */}
          <WeatherCard
            currentDate={currentDate}
            currentTime={displayTime} // Use displayTime here
            userName={userProfile?.full_name || 'Friend'}
          />

          {/* Trip Overview */}
          <TripOverview profile={userProfile} />

          {/* Recommendations */}
          {/* TODO: Check if RecommendationCard needs adjustment for PointOfInterest type vs Listing type - Addressed by mapping */}
          <RecommendationTabs
            activities={mappedActivities} // Use the mapped data
            dining={dining}
            accommodation={accommodation}
            activitiesLoading={activitiesLoading} // Still use the loading state from usePois
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
