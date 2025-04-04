
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { OperatorStatus } from '@/types/database'; // Import the OperatorStatus type

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

  // Type guard to ensure operator.status is treated as OperatorStatus
  const getStatus = (): OperatorStatus => {
    if (!operator) return OperatorStatus.PENDING_VERIFICATION;
    return operator.status as OperatorStatus;
  };

  // Use this function to safely compare statuses
  const isStatus = (status: OperatorStatus): boolean => {
    return getStatus() === status;
  };

  // This would replace the conditional rendering in the original component
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isStatus(OperatorStatus.REJECTED)) {
    return <div>Your application has been rejected</div>;
  }

  if (isStatus(OperatorStatus.NEEDS_INFO)) {
    return <div>We need more information</div>;
  }

  if (isStatus(OperatorStatus.PENDING_VERIFICATION)) {
    return <div>Your application is pending verification</div>;
  }

  if (isStatus(OperatorStatus.VERIFIED)) {
    return <div>You are verified!</div>;
  }

  return <div>Unknown status</div>;
};

export default OperatorDashboardWrapper;
