
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, BookOpen, Tag } from 'lucide-react'; // Icons
import { PointOfInterest } from '@/types/database';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Define the expected props based on the PointOfInterest type
interface PoiCardProps {
  poi: PointOfInterest;
  // Add onClick or link props if the card should be interactive
  onClick?: (poiId: string) => void;
}

const PoiCard: React.FC<PoiCardProps> = ({ poi, onClick }) => {
  const imageUrl = poi.images?.[0] || '/placeholder.svg'; // Use first image or placeholder

  const handleCardClick = () => {
    if (onClick) {
      onClick(poi.id);
    }
  };

  return (
    <Card
      className={`w-full overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl}
            alt={poi.name ?? 'Point of Interest'}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 grid gap-2">
        <CardTitle className="text-lg">{poi.name}</CardTitle>
        {poi.category && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="h-3 w-3 mr-1" />
            {poi.category}
          </div>
        )}
        <CardDescription className="text-sm line-clamp-3">
          {poi.description || 'No description available.'}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default PoiCard;
