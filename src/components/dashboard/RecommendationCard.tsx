
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Listing } from '@/types/database';

interface RecommendationCardProps {
  item: Listing;
}

const RecommendationCard = ({ item }: RecommendationCardProps) => (
  <div className="relative rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300">
    <img 
      src={item.images?.[0] || "https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
      alt={item.title} 
      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
      <h3 className="text-white font-medium">{item.title}</h3>
      <div className="flex justify-between items-center mt-1">
        <Badge variant="outline" className="text-white border-white/50 bg-white/10">
          {item.sub_category || item.category}
        </Badge>
        <div className="flex items-center text-yellow-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-4 h-4 mr-1"
          >
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-sm">{item.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default RecommendationCard;
