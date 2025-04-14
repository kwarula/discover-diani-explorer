import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Operator } from '@/types/supabase';
import VerifiedBadge from '../ui/VerifiedBadge';

interface VerifiedOperatorCardProps {
  operator: Operator;
}

const VerifiedOperatorCard: React.FC<VerifiedOperatorCardProps> = ({ operator }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={operator.cover_photo_url || '/placeholder.jpg'}
          alt={operator.business_name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          {operator.is_verified && <VerifiedBadge />}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{operator.business_name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{operator.description}</p>
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{operator.address_city}, {operator.address_country}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <Star className="mr-1 h-4 w-4 text-yellow-500" />
          <span>4.5 (123 reviews)</span> {/* Replace with actual rating */}
        </div>
        <Badge className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          {operator.business_type}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex flex-col items-start">
          <a href={`tel:${operator.contact_phone}`} className="text-ocean hover:text-ocean-dark text-sm flex items-center">
            <Phone className="mr-1 h-4 w-4" />
            {operator.contact_phone}
          </a>
          <a href={`mailto:${operator.contact_email}`} className="text-ocean hover:text-ocean-dark text-sm flex items-center">
            <Mail className="mr-1 h-4 w-4" />
            {operator.contact_email}
          </a>
        </div>
        <Button asChild>
          <Link to={`/operators/${operator.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerifiedOperatorCard;
