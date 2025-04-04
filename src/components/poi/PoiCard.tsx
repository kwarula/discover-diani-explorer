
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { PointOfInterest } from '@/types/database';
import { useNavigate } from 'react-router-dom';

interface PoiCardProps {
  poi: PointOfInterest;
}

const PoiCard = ({ poi }: PoiCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/poi/${poi.id}`);
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={poi.image_urls?.[0] || '/placeholder-poi.jpg'}
          alt={poi.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {poi.category}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-md mb-1">{poi.name}</h3>
        <div className="flex items-center text-muted-foreground text-xs mb-2">
          <MapPin className="mr-1 h-3 w-3" />
          <span>
            {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{poi.description}</p>
      </CardContent>
    </Card>
  );
};

export default PoiCard;
