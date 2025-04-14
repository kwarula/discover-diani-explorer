import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase, checkSupabaseHealth } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type OperatorCheckStatus = 'idle' | 'checking' | 'exists' | 'not_exists' | 'error';
type DatabaseStatus = 'unknown' | 'healthy' | 'error';

const AuthRequired: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading, profile } = useAuth();
  const location = useLocation();
  const [operatorStatus, setOperatorStatus] = useState<OperatorCheckStatus>('idle');
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>('unknown');
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  
  // Add a timeout to detect long loading times
  useEffect(() => {
    if (isAuthLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isAuthLoading]);
  
  // Check database health if loading takes too long
  useEffect(() => {
    if (loadingTimeout && dbStatus === 'unknown') {
      const checkHealth = async () => {
        const isHealthy = await checkSupabaseHealth();
        setDbStatus(isHealthy ? 'healthy' : 'error');
        
        if (!isHealthy) {
          toast.error('Database connection issue detected. Please check your network or try again later.');
        }
      };
      
      checkHealth();
    }
  }, [loadingTimeout, dbStatus]);

  // Function to attempt profile creation
  const createProfile = async () => {
    if (!user || isCreatingProfile) return;
    
    try {
      setIsCreatingProfile(true);
      
      // Create initial profile with default fields
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        toast.error('Could not get user data');
        return;
      }
      
      const initialProfileData = {
        id: user.id,
        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || 'User',
        username: null,
        avatar_url: null,
        bio: null,
        is_tourist: true,
        dietary_preferences: [],
        interests: [],
        stay_duration: null,
        role: 'user',
        status: 'active'
      };
      
      // Try to insert profile
      const { error } = await supabase
        .from('profiles')
        .insert([initialProfileData]);
      
      if (error) {
        if (error.code === '23505') { // Unique violation - profile exists
          toast.info('Profile already exists. Refreshing...');
          window.location.reload();
        } else if (error.message?.includes('violates row-level security policy')) {
          // If RLS error, try simpler structure
          const { error: simpleError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, full_name: initialProfileData.full_name }]);
          
          if (simpleError) {
            toast.error('Could not create profile due to permission issues');
          } else {
            toast.success('Profile created successfully');
            window.location.reload();
          }
        } else {
          toast.error(`Profile creation failed: ${error.message}`);
        }
      } else {
        toast.success('Profile created successfully');
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`);
    } finally {
      setIsCreatingProfile(false);
    }
  };

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
            .maybeSingle() as any;

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
  // Still waiting for initial auth check OR waiting for operator check or profile creation
  if (isAuthLoading || isCreatingProfile || operatorStatus === 'checking' || (user && operatorStatus === 'idle')) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-ocean mb-4" />
        <p className="text-ocean text-center mb-2">
          {isCreatingProfile ? 'Creating your profile...' : 'Loading your account information...'}
        </p>
        
        {/* Show extra information if loading takes too long */}
        {loadingTimeout && !isCreatingProfile && (
          <div className="mt-4 max-w-md">
            {dbStatus === 'error' ? (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="font-medium text-red-800">Database Connection Issue</p>
                </div>
                <p className="text-sm text-red-700">
                  We're having trouble connecting to our database. This could be due to:
                </p>
                <ul className="text-sm text-red-700 list-disc pl-5 mt-2">
                  <li>Network connectivity issues</li>
                  <li>Database maintenance</li>
                  <li>Temporary service disruption</li>
                </ul>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  This is taking longer than expected. Please wait a moment...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // User is authenticated but profile is missing
  if (user && !profile && !isAuthLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
        <p className="text-gray-600 max-w-md text-center mb-4">
          We couldn't find your profile information. This may happen if your profile wasn't created properly during signup.
        </p>
        <div className="flex gap-3">
          <button
            onClick={createProfile}
            className="px-4 py-2 bg-ocean text-white rounded hover:bg-ocean-dark"
          >
            Create Profile
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Reload Page
          </button>
        </div>
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
