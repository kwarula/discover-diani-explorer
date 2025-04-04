
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Landmark, 
  Building, 
  Mountain, 
  Palmtree, 
  Umbrella, 
  Leaf,
  Info,
  Clock,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { PointOfInterest } from '@/types/database';
import { getCategoryName } from '@/hooks/usePOI';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'historical_site':
      return <Landmark className="h-4 w-4 mr-1" />;
    case 'natural_feature':
      return <Palmtree className="h-4 w-4 mr-1" />;
    case 'cultural_site':
      return <Building className="h-4 w-4 mr-1" />;
    case 'conservation_site':
      return <Leaf className="h-4 w-4 mr-1" />;
    case 'viewpoint':
      return <Mountain className="h-4 w-4 mr-1" />;
    case 'beach_area':
      return <Umbrella className="h-4 w-4 mr-1" />;
    default:
      return <MapPin className="h-4 w-4 mr-1" />;
  }
};

interface POICardProps {
  poi: PointOfInterest;
  featured?: boolean;
}

const POICard = ({ poi, featured = false }: POICardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={poi.images && poi.images.length > 0 ? poi.images[0] : '/placeholder.svg'}
          alt={poi.name}
          className="w-full h-full object-cover"
        />
        {(featured || poi.featured) && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge className="bg-white/90 text-gray-800 flex items-center">
            {getCategoryIcon(poi.category)}
            {getCategoryName(poi.category)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5 flex flex-col flex-grow">
        <h3 className="font-display text-lg font-semibold mb-2">{poi.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{poi.description}</p>
        
        <div className="space-y-2 mb-4">
          {poi.entrance_fee && (
            <div className="flex items-center text-xs text-gray-500">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>{poi.entrance_fee}</span>
            </div>
          )}
          
          {poi.best_visit_time && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Best time: {poi.best_visit_time}</span>
            </div>
          )}
          
          {poi.guide_required && (
            <div className="flex items-center text-xs text-gray-500">
              <UserCheck className="h-3.5 w-3.5 mr-1" />
              <span>Guide recommended</span>
            </div>
          )}
        </div>
        
        <Button variant="outline" className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white" asChild>
          <Link to={`/poi/${poi.id}`}>
            <Info className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default POICard;
