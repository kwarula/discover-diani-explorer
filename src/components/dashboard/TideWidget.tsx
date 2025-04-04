
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves } from 'lucide-react'; // Icon for tides
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { format } from 'date-fns'; // For formatting time
import { useApiKey } from '@/hooks/useApiKey';

// Diani Beach Coordinates (approximate)
const DIANI_LAT = -4.2833;
const DIANI_LNG = 39.5833;

// Interface for Storm Glass API response data (extremes endpoint)
interface StormGlassTideExtreme {
    height: number;
    time: string; // ISO 8601 format (e.g., "2019-03-15T03:40:44+00:00")
    type: 'high' | 'low';
}

interface StormGlassTideMeta {
    cost: number;
    dailyQuota: number;
    end: string;
    lat: number;
    lng: number;
    requestCount: number;
    start: string;
    station: {
        distance: number;
        lat: number;
        lng: number;
        name: string;
        source: string;
    };
}

interface StormGlassTideExtremesResponse {
    data: StormGlassTideExtreme[];
    meta: StormGlassTideMeta;
}

// Processed tide data for display
interface ProcessedTideData {
  nextLow: { time: string; height: number } | null;
  nextHigh: { time: string; height: number } | null;
  // We don't get current level/state from the extremes endpoint
}

const TideWidget: React.FC = () => {
  const [tideData, setTideData] = useState<ProcessedTideData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    apiKey: stormglassApiKey, 
    loading: loadingStormGlassKey,
    error: stormGlassKeyError 
  } = useApiKey('stormglass', { showToastOnError: false });

  useEffect(() => {
    const fetchTides = async () => {
      // Wait for API key to load before proceeding
      if (loadingStormGlassKey) {
        return;
      }
      
      setIsLoading(true);
      setError(null);

      if (!stormglassApiKey) {
        setError(stormGlassKeyError || "Storm Glass API key is missing.");
        setIsLoading(false);
        return;
      }

      // Calculate start and end times for the API request (e.g., next 24 hours)
      const now = new Date();
      const startTimestamp = Math.floor(now.getTime() / 1000); // Current time in seconds
      const endTimestamp = startTimestamp + 24 * 60 * 60; // 24 hours from now

      const params = new URLSearchParams({
        lat: DIANI_LAT.toString(),
        lng: DIANI_LNG.toString(),
        start: startTimestamp.toString(),
        end: endTimestamp.toString(),
        // datum: 'MLLW' // Optionally change datum if needed
      });

      const apiUrl = `https://api.stormglass.io/v2/tide/extremes/point?${params.toString()}`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': stormglassApiKey,
          },
        });

        if (!response.ok) {
          // Attempt to parse error response from Storm Glass
          let errorBody = 'Failed to fetch tide data.';
          try {
            const errorJson = await response.json();
            errorBody = errorJson.errors?.key?.[0] || `HTTP error! status: ${response.status}`;
          } catch (parseError) {
             // Ignore if error body isn't JSON
          }
          throw new Error(errorBody);
        }

        const result: StormGlassTideExtremesResponse = await response.json();

        // Process the data to find the *next* low and high tides after the current time
        const nowIso = now.toISOString();
        let nextLow: { time: string; height: number } | null = null;
        let nextHigh: { time: string; height: number } | null = null;

        for (const extreme of result.data) {
            if (extreme.time > nowIso) { // Find the first extremes after the current time
                if (extreme.type === 'low' && !nextLow) {
                    nextLow = { time: format(new Date(extreme.time), 'HH:mm'), height: extreme.height };
                } else if (extreme.type === 'high' && !nextHigh) {
                    nextHigh = { time: format(new Date(extreme.time), 'HH:mm'), height: extreme.height };
                }
            }
            // Stop if we've found both
            if (nextLow && nextHigh) break;
        }

        setTideData({ nextLow, nextHigh });

      } catch (err: any) {
        console.error("Error fetching tide data:", err);
        setError(err.message || 'Could not load tide information.');
        setTideData(null); // Clear any old data
      } finally {
        setIsLoading(false);
      }
    };

    fetchTides();
  }, [stormglassApiKey, loadingStormGlassKey, stormGlassKeyError]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tide Levels</CardTitle>
        <Waves className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {!isLoading && !error && tideData && (
          <div className="space-y-1 text-xs">
             {tideData.nextLow ? (
                <p>Next Low: {tideData.nextLow.time} ({tideData.nextLow.height.toFixed(1)}m)</p>
             ) : (
                <p className="text-muted-foreground">Next low tide data unavailable.</p>
             )}
             {tideData.nextHigh ? (
                <p>Next High: {tideData.nextHigh.time} ({tideData.nextHigh.height.toFixed(1)}m)</p>
             ) : (
                 <p className="text-muted-foreground">Next high tide data unavailable.</p>
             )}
          </div>
        )}
         {!isLoading && !error && !tideData && (
             <p className="text-xs text-muted-foreground">Tide data unavailable.</p>
         )}
      </CardContent>
    </Card>
  );
};

export default TideWidget;
