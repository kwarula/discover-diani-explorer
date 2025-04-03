
import { useState, useEffect } from 'react';
import axios from 'axios';

// Types for tide data
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

  useEffect(() => {
    const fetchTideData = async () => {
      setLoading(true);
      setError(null);

      // World Tides API key from environment variable
      const WORLD_TIDES_API_KEY = import.meta.env.VITE_WORLD_TIDES_API_KEY;
      
      // Diani Beach coordinates
      const LAT = -4.28;
      const LON = 39.58;
      
      // Check if API key exists
      if (!WORLD_TIDES_API_KEY) {
        console.error('World Tides API key is missing');
        setError('World Tides API key is missing. Please check your environment variables.');
        setLoading(false);
        
        // Provide fallback data for development
        const fallbackData: TidePoint[] = [
          {
            type: 'high',
            time: '08:30 AM',
            height: 1.8,
            timestamp: Date.now() + 1000 * 60 * 60 * 2 // 2 hours from now
          },
          {
            type: 'low',
            time: '2:45 PM',
            height: 0.3,
            timestamp: Date.now() + 1000 * 60 * 60 * 6 // 6 hours from now
          },
          {
            type: 'high',
            time: '9:10 PM',
            height: 1.9,
            timestamp: Date.now() + 1000 * 60 * 60 * 12 // 12 hours from now
          },
          {
            type: 'low',
            time: '3:20 AM (Tomorrow)',
            height: 0.2,
            timestamp: Date.now() + 1000 * 60 * 60 * 18 // 18 hours from now
          }
        ];
        
        setTideData(fallbackData);
        return;
      }
      
      try {
        // Current date in format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        // World Tides API endpoint
        const response = await axios.get(
          `https://www.worldtides.info/api/v3?extremes&date=${today}&lat=${LAT}&lon=${LON}&key=${WORLD_TIDES_API_KEY}`
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
        const fallbackData: TidePoint[] = [
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
        
        setTideData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchTideData();
  }, []);

  return { tideData, loading, error };
};

export default useTideData;
