
import React from 'react';
import { Calendar, Compass, Map } from 'lucide-react';
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
  );
};

export default TripOverview;
