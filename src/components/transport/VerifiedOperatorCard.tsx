
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, MessageSquare } from 'lucide-react'; // Icons for phone and WhatsApp
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Operator } from '@/types/database';

interface VerifiedOperatorCardProps {
  operator: Operator;
}

const VerifiedOperatorCard: React.FC<VerifiedOperatorCardProps> = ({ operator }) => {
  // Basic fallback for avatar if no image
  const fallbackName = operator.business_name?.substring(0, 2).toUpperCase() || 'OP';
  const whatsappLink = `https://wa.me/${operator.contact_phone?.replace(/[^0-9]/g, '')}`; // Basic WhatsApp link generation

  return (
    <Link to={`/operator/${operator.id}`} className="block group"> {/* Wrap card in Link */}
      <Card className="w-full max-w-sm overflow-hidden group-hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"> {/* Added styles */}
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 bg-muted/50 p-4">
          <Avatar className="h-16 w-16 border">
          <AvatarImage src={operator.logo_url ?? undefined} alt={operator.business_name ?? 'Operator'} />
          <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle className="flex items-center gap-2">
            {operator.business_name}
            <VerifiedBadge isVerified={operator.is_verified} />
          </CardTitle>
          <CardDescription>
            {/* Display specialties or business type */}
            {operator.specialties?.join(', ') || 'Transport Operator'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid gap-3 text-sm">
        {operator.service_area_description && (
          <div className="font-medium">
            Operating Areas: <span className="font-normal text-muted-foreground">{operator.service_area_description}</span>
          </div>
        )}
        {operator.contact_phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${operator.contact_phone}`} className="text-blue-600 hover:underline">
              {operator.contact_phone}
            </a>
            {/* Basic WhatsApp link - consider country code logic */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-green-600 hover:text-green-700"
              aria-label="Contact via WhatsApp"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
        )}
         <div className="mt-auto pt-2 text-right text-sm text-ocean group-hover:underline">
            View Profile &rarr;
         </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default VerifiedOperatorCard;
