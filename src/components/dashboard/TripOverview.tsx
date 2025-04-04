import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTideData } from '@/hooks/useTideData';
import usePois from '@/hooks/usePois'; // Import usePois
import { Waves, Calendar, Compass, Map, Edit2, PlusCircle, AlertCircle, Loader2 } from 'lucide-react'; // Added icons
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile, PointOfInterest } from '@/types/database'; // Added PointOfInterest

interface TripOverviewProps {
  profile: Profile | null;
}

const TripOverview = ({ profile }: TripOverviewProps) => {
  // Safely access the hook data with proper loading and error handling
  const { tideData, loading: tideLoading, error: tideError } = useTideData();
  const { pois, loading: poisLoading, error: poisError } = usePois(); // Use the hook

  const getCurrentTideState = () => {
    if (!tideData || tideData.length < 2) return null;
    
    const now = Date.now();
    const sortedTides = [...tideData].sort((a, b) => a.timestamp - b.timestamp);
    
    for (let i = 0; i < sortedTides.length - 1; i++) {
      if (now >= sortedTides[i].timestamp && now < sortedTides[i + 1].timestamp) {
        return {
          current: sortedTides[i].type,
          next: sortedTides[i + 1].type,
          timeTillNext: Math.floor((sortedTides[i + 1].timestamp - now) / (1000 * 60)),
          nextHeight: sortedTides[i + 1].height
        };
      }
    }
    
    return null;
  };
  
  const tideState = getCurrentTideState();
  
  const getTideSuggestions = () => {
    if (!tideState) return [];
    
    if (tideState.current === 'low') {
      return [
        "Visit Africa Pool while the tide is low",
        "Explore the exposed sandbars and coral formations",
        "Go beachcombing for shells and sea treasures"
      ];
    } else {
      return [
        "Great time for swimming and snorkeling",
        "Book a glass-bottom boat tour",
        "Try kitesurfing or paddleboarding"
      ];
    }
  };
  
  const tideSuggestions = getTideSuggestions();

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-display font-bold mb-6 text-gray-800">Your Trip Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-ocean" />
              Trip Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.stay_duration ? (
              <>
                <p className="text-3xl font-bold text-ocean-dark">{profile.stay_duration} days</p>
                <p className="text-gray-500 text-sm">Planned stay duration</p> 
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Add your trip dates for better recommendations!</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile"> {/* Changed link destination */}
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Dates
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
             <CardTitle className="text-lg flex items-center">
               <Compass className="w-5 h-5 mr-2 text-coral" />
               Your Interests
             </CardTitle>
             {profile?.interests && profile.interests.length > 0 && (
               <Button variant="ghost" size="sm" className="text-coral hover:text-coral-dark p-1 h-auto" asChild>
                 <Link to="/profile"> {/* Changed link destination */}
                   <Edit2 className="w-4 h-4" />
                 </Link>
               </Button>
             )}
          </CardHeader>
          <CardContent>
            {profile?.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <Badge key={i} className="bg-coral/10 text-coral hover:bg-coral/20 border-none">
                    {interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center">
                 <p className="text-sm text-gray-500 mb-3">Tell us your interests for personalized tips!</p>
                 <Button variant="outline" size="sm" asChild>
                   <Link to="/profile"> {/* Changed link destination */}
                     <PlusCircle className="w-4 h-4 mr-2" /> Add Interests
                   </Link>
                 </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Map className="w-5 h-5 mr-2 text-ocean" />
              Explore Nearby
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
             <p className="text-gray-500 text-sm mb-3">Discover attractions around you.</p>
             <div className="text-sm text-gray-600 mb-4 space-y-2 flex-grow">
               {poisLoading ? (
                 <div className="flex items-center justify-center py-4">
                   <Loader2 className="w-6 h-6 animate-spin text-ocean" />
                 </div>
               ) : poisError ? (
                 <div className="flex items-center text-red-600">
                   <AlertCircle className="w-4 h-4 mr-2" />
                   <span>{typeof poisError === 'string' ? poisError : 'Error loading POIs'}</span>
                 </div>
               ) : pois && pois.length > 0 ? (
                 // Display first 2 POIs as simple links for now
                 pois.slice(0, 2).map((poi: PointOfInterest) => (
                   <Link key={poi.id} to={`/poi/${poi.id}`} className="block hover:text-ocean-dark group">
                     <p className="font-medium group-hover:underline">{poi.name}</p>
                     <p className="text-xs text-gray-500">{poi.category}</p>
                   </Link>
                 ))
               ) : (
                 <p>No points of interest found.</p>
               )}
             </div>
             {/* Link the button to the Explore page */}
             <Button className="mt-auto bg-ocean hover:bg-ocean-dark text-white w-full" asChild>
               <Link to="/explore">Open Interactive Map</Link>
             </Button>
          </CardContent>
        </Card>
        
        {!tideLoading && !tideError && tideState && (
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-3 ${tideState.current === 'high' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                  <Waves size={24} className={tideState.current === 'high' ? 'text-blue-500' : 'text-amber-500'} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Current Tide: {tideState.current === 'high' ? 'High' : 'Low'}</h3>
                  <p className="text-sm text-gray-600">
                    {tideState.timeTillNext} minutes until {tideState.next === 'high' ? 'high' : 'low'} tide ({tideState.nextHeight}m)
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Suggested Activities:</h4>
                <ul className="space-y-1">
                  {tideSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-ocean-dark mr-2">•</span> {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
        {tideLoading && (
          <Card className="bg-gray-50">
            <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
              <Loader2 className="w-6 h-6 animate-spin text-ocean mr-2" />
              <p className="text-ocean">Loading tide information...</p>
            </CardContent>
          </Card>
        )}
        
        {tideError && !tideLoading && (
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-600 mb-3">
                <AlertCircle className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Unable to load tide data</h3>
              </div>
              <p className="text-sm text-gray-600">
                We'll have tide predictions available for you soon. In the meantime, 
                check with local beachfront services for current conditions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripOverview;
