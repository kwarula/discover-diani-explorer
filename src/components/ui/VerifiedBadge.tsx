import React from 'react';
import { BadgeCheck } from 'lucide-react'; // Using lucide-react icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Assuming tooltip component exists

interface VerifiedBadgeProps {
  isVerified: boolean | null | undefined;
  tooltipContent?: string;
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isVerified,
  tooltipContent = 'Verified Operator/Guide',
  className = '',
}) => {
  if (!isVerified) {
    return null; // Don't render anything if not verified
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center text-blue-600 ${className}`}>
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            {/* Optional: Add text like "Verified" */}
            {/* <span className="ml-1 text-xs font-medium">Verified</span> */}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerifiedBadge;
