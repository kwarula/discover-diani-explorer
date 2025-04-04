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

        // Handle email confirmation
        // When user clicks the email confirmation link, Supabase redirects to this page with #access_token in URL
        if (window.location.hash) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            setMessage('Authentication successful! Redirecting...');
            toast.success('Email confirmed successfully');
            
            // Redirect to dashboard after successful confirmation
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        } else {
          // Handle OAuth redirects
          const code = searchParams.get('code');
          
          if (code) {
            setMessage('Completing authentication...');
            
            // The exchange is handled automatically by Supabase Auth client
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              throw error;
            }
            
            if (data?.session) {
              setMessage('Authentication successful! Redirecting...');
              toast.success('Signed in successfully');
              
              // Redirect to dashboard after successful login
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              throw new Error('No session found');
            }
          } else {
            // No code or access_token found
            setMessage('Returning to application...');
            
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