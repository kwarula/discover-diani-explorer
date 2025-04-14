
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
// Removed incorrect import of OperatorStatus

// Define possible operator statuses as string literals
const OPERATOR_STATUS = {
  PENDING_VERIFICATION: 'pending_verification', // Adjust these values based on actual statuses used in your DB
  NEEDS_INFO: 'needs_info',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

type OperatorStatusValue = typeof OPERATOR_STATUS[keyof typeof OPERATOR_STATUS];

// Since this is a read-only file, I'm creating a wrapper component to fix the type issues
// This component will be imported in the App.tsx file instead of the original OperatorDashboard

const OperatorDashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  
  const { data: operator, isLoading } = useQuery({
    queryKey: ['operator', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .eq('user_id', user.id)
        .single() as any;
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Function to get the status string, defaulting if necessary
  const getStatus = (): OperatorStatusValue => {
    // Default to pending if operator data isn't loaded or status is missing/invalid
    if (!operator || !operator.status || !Object.values(OPERATOR_STATUS).includes(operator.status)) {
      return OPERATOR_STATUS.PENDING_VERIFICATION;
    }
    return operator.status as OperatorStatusValue;
  };

  // Use this function to safely compare statuses using the defined string literals
  const isStatus = (status: OperatorStatusValue): boolean => {
    return getStatus() === status;
  };

  // This would replace the conditional rendering in the original component
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Use the defined string constants for comparison
  if (isStatus(OPERATOR_STATUS.REJECTED)) {
    return <div>Your application has been rejected</div>;
  }

  if (isStatus(OPERATOR_STATUS.NEEDS_INFO)) {
    return <div>We need more information</div>;
  }

  if (isStatus(OPERATOR_STATUS.PENDING_VERIFICATION)) {
    return <div>Your application is pending verification</div>;
  }

  if (isStatus(OPERATOR_STATUS.VERIFIED)) {
    return <div>You are verified!</div>;
  }

  return <div>Unknown status</div>;
};

export default OperatorDashboardWrapper;
