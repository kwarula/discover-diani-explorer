import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Calendar, Compass, Map, Edit2, PlusCircle } from 'lucide-react'; // Add Edit2, PlusCircle
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/database';

interface TripOverviewProps {
  profile: Profile | null;
}

const TripOverview = ({ profile }: TripOverviewProps) => {
  return (
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
            {profile?.stay_duration ? (
              <>
                <p className="text-3xl font-bold text-ocean-dark">{profile.stay_duration} days</p>
                <p className="text-gray-500 text-sm">Planned stay duration</p> 
                {/* TODO: Could calculate remaining days if start/end dates are available */}
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Add your trip dates for better recommendations!</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile/edit"> {/* Assuming a profile edit route */}
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
             {/* Add Edit button only if interests exist */}
             {profile?.interests && profile.interests.length > 0 && (
               <Button variant="ghost" size="sm" className="text-coral hover:text-coral-dark p-1 h-auto" asChild>
                 <Link to="/profile/edit"> {/* Assuming a profile edit route */}
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
                   <Link to="/profile/edit"> {/* Assuming a profile edit route */}
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
          <CardContent className="flex flex-col flex-grow"> {/* Use flex-grow */}
             <p className="text-gray-500 text-sm mb-3">Discover attractions around you.</p>
             {/* Placeholder for nearby suggestions */}
             <div className="text-sm text-gray-600 mb-4 space-y-1 flex-grow">
               <p><i>Nearby suggestions coming soon...</i></p> 
               {/* Example: <p>• Forty Thieves Beach Bar (5 min walk)</p> */}
             </div>
             <Button className="mt-auto bg-ocean hover:bg-ocean-dark text-white w-full"> {/* Make button full width */}
               Open Interactive Map
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripOverview;
