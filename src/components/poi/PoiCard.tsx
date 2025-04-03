import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, BookOpen, Tag } from 'lucide-react'; // Icons
import { Tables } from '@/types/database';
import { AspectRatio } from '@/components/ui/aspect-ratio'; // Assuming aspect ratio component exists

// Define the expected props based on the 'points_of_interest' table structure
interface PoiCardProps {
  poi: Pick<
    Tables<'points_of_interest'>,
    | 'id'
    | 'name'
    | 'description'
    | 'category'
    | 'image_urls' // Use the first image as the card image
    // Add other fields as needed for display or linking
  >;
  // Add onClick or link props if the card should be interactive
  onClick?: (poiId: number) => void;
}

const PoiCard: React.FC<PoiCardProps> = ({ poi, onClick }) => {
  const imageUrl = poi.image_urls?.[0] || '/placeholder.svg'; // Use first image or placeholder

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
        {/* Optional: Add location icon or link to map */}
        {/* <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          Location Placeholder
        </div> */}
        {/* Optional: Add link/button to view details */}
        {/* {onClick && (
          <Button variant="link" size="sm" className="p-0 h-auto justify-start">
            Learn More
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
};

export default PoiCard;
