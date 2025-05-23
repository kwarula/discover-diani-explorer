import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants for Diani Beach, Kenya
const LAT = -4.2767;
const LON = 39.5867;

// Type for individual tide data points
export interface TidePoint {
  type: 'high' | 'low';
  time: string;
  height: number;
  timestamp: number;
}

export const useTideData = () => {
  const [tideData, setTideData] = useState<TidePoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // API key from environment variable
  const [worldTidesApiKey, setWorldTidesApiKey] = useState<string>('');
  const [loadingWorldTidesKey, setLoadingWorldTidesKey] = useState<boolean>(true);
  const [worldTidesKeyError, setWorldTidesKeyError] = useState<boolean>(false);
  
  // Get API key
  useEffect(() => {
    const apiKey = import.meta.env.VITE_WORLDTIDES_API_KEY;
    
    if (apiKey) {
      setWorldTidesApiKey(apiKey);
      setLoadingWorldTidesKey(false);
    } else {
      console.error('World Tides API key not found in environment variables');
      setWorldTidesKeyError(true);
      setLoadingWorldTidesKey(false);
      
      // Generate fallback data immediately when key is missing
      const fallbackData: TidePoint[] = generateFallbackData();
      setTideData(fallbackData);
      setLoading(false);
    }
  }, []);
  
  // Fetch tide data
  useEffect(() => {
    // Skip fetching if we're still loading the API key or there was an error
    if (loadingWorldTidesKey || worldTidesKeyError || !worldTidesApiKey) {
      return;
    }
    
    const fetchTideData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set today's date in the format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        // World Tides API endpoint
        const response = await axios.get(
          `https://www.worldtides.info/api/v3?extremes&date=${today}&lat=${LAT}&lon=${LON}&key=${worldTidesApiKey}`,
          { timeout: 10000 } // Add 10s timeout to prevent long blocking
        );
        
        if (response.data && response.data.extremes) {
          // Process the tide data
          const processedData: TidePoint[] = response.data.extremes.map((extreme: any) => {
            // Convert timestamp to readable time
            const date = new Date(extreme.dt * 1000);
            const isToday = new Date().toDateString() === date.toDateString();
            
            // Format time with AM/PM
            const timeStr = date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
            
            // Add "(Tomorrow)" for times not on today's date
            const formattedTime = isToday ? timeStr : `${timeStr} (Tomorrow)`;
            
            return {
              type: extreme.type === 'High' ? 'high' : 'low',
              time: formattedTime,
              height: parseFloat(extreme.height.toFixed(1)),
              timestamp: extreme.dt * 1000
            };
          });
          
          setTideData(processedData);
        } else {
          throw new Error('Invalid response format from tide API');
        }
      } catch (err) {
        console.error('Error fetching tide data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tide data');
        
        // Provide fallback data in case of error
        const fallbackData: TidePoint[] = generateFallbackData();
        setTideData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchTideData();
  }, [worldTidesApiKey, loadingWorldTidesKey, worldTidesKeyError]);

  const generateFallbackData = (): TidePoint[] => {
    return [
      {
        type: 'high',
        time: '08:30 AM',
        height: 1.8,
        timestamp: Date.now() + 1000 * 60 * 60 * 2
      },
      {
        type: 'low',
        time: '2:45 PM',
        height: 0.3,
        timestamp: Date.now() + 1000 * 60 * 60 * 6
      },
      {
        type: 'high',
        time: '9:10 PM',
        height: 1.9,
        timestamp: Date.now() + 1000 * 60 * 60 * 12
      },
      {
        type: 'low',
        time: '3:20 AM (Tomorrow)',
        height: 0.2,
        timestamp: Date.now() + 1000 * 60 * 60 * 18
      }
    ];
  };

  return { tideData, loading, error };
};

export default useTideData;
