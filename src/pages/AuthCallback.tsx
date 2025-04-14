import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>('Processing your authentication...');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get error if present from URL params
        const errorDescription = searchParams.get('error_description');
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // First fetch the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        // If we have a valid session, proceed
        if (sessionData?.session) {
          setMessage('Authentication successful! Retrieving profile...');
          
          // Give a small delay for the session to be properly established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try to fetch the user's profile
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', sessionData.session.user.id)
              .single();
              
            // If profile doesn't exist, try to create it
            if (profileError && profileError.code === 'PGRST116') { // Not found
              const { error: createError } = await supabase
                .from('profiles')
                .insert([{ 
                  id: sessionData.session.user.id,
                  full_name: sessionData.session.user.user_metadata?.full_name || 
                            sessionData.session.user.user_metadata?.name || 'User',
                  role: 'user',
                  status: 'active'
                }]);
                
              if (createError) {
                console.warn('Could not create profile on callback:', createError);
                // Continue even if profile creation fails - we'll try again later
              } else {
                console.log('Profile created successfully on callback');
              }
            } else if (profileData) {
              console.log('Profile found:', profileData);
            }
          } catch (profileCheckError) {
            console.warn('Error checking/creating profile:', profileCheckError);
            // Continue even if this fails
          }
          
          setMessage('Authentication successful! Redirecting...');
          
          // Email confirmation case
          if (window.location.hash && window.location.hash.includes('access_token')) {
            toast.success('Email confirmed successfully');
          } else {
            toast.success('Signed in successfully');
          }
          
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // No session found, but no error - could be a code exchange in progress
          // Check if we have a code parameter for OAuth
          const code = searchParams.get('code');
          
          if (code) {
            setMessage('Authorization code received, completing sign-in...');
            
            // Try a brief wait and check session again in case the exchange is still being processed
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const { data: refreshedSessionData, error: refreshedSessionError } = 
              await supabase.auth.getSession();
            
            if (refreshedSessionError) {
              throw refreshedSessionError;
            }
            
            if (refreshedSessionData?.session) {
              setMessage('Authentication successful! Redirecting...');
              toast.success('Signed in successfully');
              
              // Redirect to dashboard after successful login
              setTimeout(() => {
                navigate('/dashboard');
              }, 1500);
            } else {
              throw new Error('No session established after code exchange');
            }
          } else {
            // No code or hash found
            setMessage('No authentication data found. Returning to application...');
            
            // Redirect to home page if no auth info found
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(true);
        setMessage(`Authentication error: ${error.message}`);
        toast.error(`Authentication failed: ${error.message}`);
        
        // Redirect to login page on error
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="p-8 rounded-lg shadow-md bg-white max-w-md w-full text-center">
        {error ? (
          <div className="text-red-500 text-xl mb-4">Error</div>
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        )}
        <h1 className="text-2xl font-bold mb-4">
          {error ? 'Authentication Failed' : 'Authentication in Progress'}
        </h1>
        <p className="text-gray-600 mb-4">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback; 