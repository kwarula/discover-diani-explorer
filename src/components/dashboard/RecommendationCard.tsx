
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Listing } from '@/types/database';
import { MapPin, Star } from 'lucide-react';

interface RecommendationCardProps {
  listing: Listing;
  onSelect?: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ listing, onSelect }) => {
  // Return early if listing is undefined to prevent errors
  if (!listing) {
    return (
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden">
        <CardContent className="p-4">
          <h3 className="font-semibold text-md mb-1">Loading...</h3>
        </CardContent>
      </Card>
    );
  }
  
  // Use a constant default rating since our listing type doesn't include rating
  const defaultRating = 4.5;
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden"
      onClick={() => onSelect && onSelect(listing.id)}
    >
      <div className="relative">
        <img 
          src={listing.images?.[0] || '/placeholder.jpg'} 
          alt={listing.title || 'Listing'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <Star className="h-3 w-3 text-yellow-500 mr-1" />
          <span>{defaultRating} ({defaultRating})</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-md mb-1 line-clamp-1">{listing.title}</h3>
        <div className="flex items-center text-muted-foreground text-xs mb-2">
          <MapPin className="mr-1 h-3 w-3" />
          <span>{listing.location || 'Diani Beach'}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
