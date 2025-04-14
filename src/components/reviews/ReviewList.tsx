
import React from 'react';
// Import ReviewWithProfile from the detail page (or move type definition to a shared location)
import { ReviewWithProfile } from '@/pages/ListingDetailPage'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, CheckCircle, User } from 'lucide-react'; // Add User icon
import { formatDistanceToNow } from 'date-fns'; 

interface ReviewListProps {
  reviews: ReviewWithProfile[]; // Use ReviewWithProfile type
  isLoading: boolean;
  error?: string | null;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading reviews...</div>; // Add a skeleton loader later
  }

  if (error) {
    return <div className="text-red-600">Error loading reviews: {error}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-muted-foreground">No reviews yet. Be the first!</div>;
  }

  return (
    <div className="space-y-6">
      {/* Removed redundant title, assuming parent component provides it */}
      {reviews.map((review) => {
        // Use profile data if available
        const reviewerName = review.profiles?.username || 'Anonymous';
        const reviewerAvatar = review.profiles?.avatar_url;
        // Generate fallback from username or default to 'A'
        const fallbackName = reviewerName ? reviewerName.charAt(0).toUpperCase() : 'A'; 
        const timeAgo = review.created_at ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true }) : '';

        return (
          <div key={review.id} className="flex space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={reviewerAvatar || undefined} alt={reviewerName} />
              <AvatarFallback>{fallbackName}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{reviewerName}</h4>
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-muted-foreground pt-1">{review.comment}</p>
              )}
              {review.used_guide && (
                 <div className="flex items-center text-xs text-green-600 pt-1">
                    <CheckCircle className="h-3 w-3 mr-1" /> Used a guide
                 </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
