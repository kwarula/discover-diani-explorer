
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    created_at: string;
    user?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
    };
    used_guide?: boolean;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get display name
  const displayName = review.user?.full_name || 
                     review.user?.username || 
                     'Anonymous User';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={review.user?.avatar_url} 
                alt={displayName} 
              />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{displayName}</p>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {review.comment && (
          <p className="text-gray-700 mb-4">{review.comment}</p>
        )}
        
        {review.used_guide !== undefined && (
          <div className={`flex items-center text-sm p-2 rounded-md ${
            review.used_guide ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
          }`}>
            {review.used_guide ? (
              <>
                <Check size={16} className="mr-2 text-blue-600" />
                Used a guide for this experience
              </>
            ) : (
              <>
                <X size={16} className="mr-2 text-gray-500" />
                Explored without a guide
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
