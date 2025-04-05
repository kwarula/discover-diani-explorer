
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ReviewCardProps {
  reviewer?: {
    name?: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  reviewer = { name: 'Anonymous', avatar: undefined },
  rating,
  comment,
  date
}) => {
  const initials = reviewer.name 
    ? reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'A';

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <Avatar>
          {reviewer.avatar ? (
            <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium">{reviewer.name}</div>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            {date && <span className="text-gray-500 text-sm ml-2">{date}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
