
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client'; // Import supabase
import { Loader2 } from 'lucide-react';

type OperatorCheckStatus = 'idle' | 'checking' | 'exists' | 'not_exists' | 'error';

const AuthRequired: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const location = useLocation();
  const [operatorStatus, setOperatorStatus] = useState<OperatorCheckStatus>('idle');

  useEffect(() => {
    // Reset check status if user logs out or auth starts loading again
    if (isAuthLoading || !user) {
      setOperatorStatus('idle');
      return;
    }

    // Only run check if user is loaded and status is idle
    if (user && operatorStatus === 'idle') {
      setOperatorStatus('checking');
      const checkOperator = async () => {
        try {
          const { data, error } = await supabase
            .from('operators')
            .select('id') // Check only for existence
            .eq('user_id', user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') { // Ignore "0 rows" error from maybeSingle
            console.error("AuthRequired: Error checking operator status", error);
            setOperatorStatus('error');
          } else if (data) {
            setOperatorStatus('exists');
          } else {
            setOperatorStatus('not_exists');
          }
        } catch (err) {
          console.error("AuthRequired: Unexpected error checking operator status", err);
          setOperatorStatus('error');
        }
      };
      checkOperator();
    }
  }, [user, isAuthLoading, operatorStatus]); // Rerun if user/loading changes, or if status resets to idle

  // --- Loading States ---
  // Still waiting for initial auth check OR waiting for operator check
  if (isAuthLoading || operatorStatus === 'checking' || (user && operatorStatus === 'idle')) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ocean" />
        <p className="ml-2 text-ocean">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthRequired;
