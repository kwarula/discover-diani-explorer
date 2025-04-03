import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palmtree, MapPin, Clock, DollarSign } from 'lucide-react';
import { PointOfInterest } from '@/types/database';

// Static placeholder image for POIs without images
const DEFAULT_IMAGE = '/placeholder.svg';

interface POICardProps {
  poi: PointOfInterest;
}

const POICard: React.FC<POICardProps> = ({ poi }) => {
  // Get the first image or use default
  const imageUrl = poi.images && poi.images.length > 0 
    ? poi.images[0] 
    : DEFAULT_IMAGE;
  
  // Format category for display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={poi.name} 
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-2 right-2"
          variant="secondary"
        >
          <Palmtree className="h-3 w-3 mr-1" />
          {formatCategory(poi.category)}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{poi.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {poi.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 text-sm">
          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}
            </span>
          </div>
          
          {/* Best visit time if available */}
          {poi.best_visit_time && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{poi.best_visit_time}</span>
            </div>
          )}
          
          {/* Entrance fee if available */}
          {poi.entrance_fee && (
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{poi.entrance_fee}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link to={`/poi/${poi.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default POICard;
