
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';

export type ApiKeyType = 'openweather' | 'stormglass' | 'worldtides';

interface UseApiKeyOptions {
  showToastOnError?: boolean;
}

export const useApiKey = (keyType: ApiKeyType, options: UseApiKeyOptions = {}) => {
  const { showToastOnError = true } = options;
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Fix: access session from the auth context correctly
  const { user, session } = useAuth();
  
  useEffect(() => {
    const fetchApiKey = async () => {
      setLoading(true);
      setError(null);
      
      // Check if we have a token to authenticate with Supabase
      if (!session?.access_token) {
        setError('Authentication required to fetch API keys');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error: fetchError } = await supabase.functions.invoke('get-api-keys', {
          body: { keyType },
        });
        
        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch API key');
        }
        
        if (!data || !data.success) {
          throw new Error(data?.error || 'Invalid response from server');
        }
        
        setApiKey(data.key);
      } catch (err: any) {
        console.error(`Error fetching ${keyType} API key:`, err);
        setError(err.message || `Failed to fetch ${keyType} API key`);
        
        if (showToastOnError) {
          toast({
            title: "API Key Error",
            description: `Could not load ${keyType} API key: ${err.message || 'Unknown error'}`,
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchApiKey();
    }
  }, [keyType, session, showToastOnError]);
  
  return { apiKey, loading, error };
};

export default useApiKey;
