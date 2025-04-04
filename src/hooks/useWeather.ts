
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, addDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useApiKey } from './useApiKey';

const LAT = -4.28; // Latitude for Diani Beach
const LON = 39.58; // Longitude for Diani Beach

// Define interfaces for the data structures
interface CurrentWeatherData {
  temp: number; 
  description: string; 
  icon: string; 
  humidity: number; 
  windSpeed: number; 
  cityName: string; 
}

interface ForecastDay {
  day: string; // e.g., "Mon"
  temp: number; // Average temp for the day
  icon: string; // Weather icon code
  description: string; // General condition (derived)
}

interface UseWeatherResult {
  currentWeather: CurrentWeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
}

// Helper to get a simplified description based on temperature
const getSimpleDescription = (temp: number): string => {
  if (temp > 28) return 'Hot';
  if (temp > 20) return 'Warm';
  if (temp > 10) return 'Cool';
  return 'Cold';
};

const useWeather = (): UseWeatherResult => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    apiKey: openweatherApiKey, 
    loading: loadingOpenWeatherKey,
    error: openWeatherKeyError 
  } = useApiKey('openweather', { showToastOnError: false });
  
  const { 
    apiKey: stormglassApiKey, 
    loading: loadingStormGlassKey,
    error: stormGlassKeyError 
  } = useApiKey('stormglass', { showToastOnError: false });

  const fetchWeatherData = useCallback(async () => {
    // Wait for API keys to load or fail before proceeding
    if (loadingOpenWeatherKey || loadingStormGlassKey) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast([]);

    let currentData: CurrentWeatherData | null = null;
    let forecastData: ForecastDay[] = [];
    let fetchError: string | null = null;

    // --- Fetch Current Weather (OpenWeatherMap) ---
    if (!openweatherApiKey) {
      fetchError = openWeatherKeyError || 'OpenWeatherMap API key is missing.';
      toast({
        title: "Weather API Error",
        description: "OpenWeatherMap API key is missing. Please contact the administrator.",
        variant: "destructive"
      });
    } else {
      try {
        const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${openweatherApiKey}&units=metric`;
        const response = await axios.get(OPENWEATHER_URL);
        const data = response.data;
        if (data && data.main && data.weather && data.weather.length > 0) {
          currentData = {
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            cityName: data.name,
          };
        } else {
          console.warn('Invalid current weather data received:', data);
          // Don't set error yet, try forecast
        }
      } catch (err) {
        console.error('Error fetching current weather:', err);
        if (axios.isAxiosError(err)) {
          fetchError = `Current Weather Error: ${err.response?.data?.message || err.message}`;
        } else {
          fetchError = 'Failed to fetch current weather.';
        }
        // Continue to try fetching forecast even if current fails
      }
    }

    // --- Fetch Forecast (Stormglass) ---
    if (!stormglassApiKey) {
      fetchError = (fetchError ? fetchError + '; ' : '') + (stormGlassKeyError || 'Stormglass API key is missing.');
      toast({
        title: "Weather API Error",
        description: "Stormglass API key is missing. Please contact the administrator.",
        variant: "destructive"
      });
    } else {
      const params = 'airTemperature'; // Only request air temperature
      const now = new Date();
      const start = startOfDay(addDays(now, 1)).toISOString(); // Start from tomorrow midnight UTC
      const end = endOfDay(addDays(now, 3)).toISOString(); // End 3 days from now midnight UTC

      try {
        const response = await axios.get('https://api.stormglass.io/v2/weather/point', {
          params: { lat: LAT, lng: LON, params, start, end },
          headers: { Authorization: stormglassApiKey },
        });

        const dailyData: { [key: string]: { temps: number[]; icons: number[] } } = {};

        response.data.hours.forEach((hour: any) => {
          const dateStr = format(parseISO(hour.time), 'yyyy-MM-dd');
          if (!dailyData[dateStr]) {
            dailyData[dateStr] = { temps: [], icons: [] };
          }
          // Check for null/undefined explicitly before pushing
          if (hour.airTemperature?.sg != null) { 
            dailyData[dateStr].temps.push(hour.airTemperature.sg);
          }
        });

        forecastData = Object.keys(dailyData).map(dateStr => {
          const dayTemps = dailyData[dateStr].temps;
          const avgTemp = dayTemps.length > 0
            ? Math.round(dayTemps.reduce((a, b) => a + b, 0) / dayTemps.length)
            : 0; // Or handle case with no temp data

          return {
            day: format(parseISO(dateStr), 'EEE'), // Format as 'Mon', 'Tue', etc.
            temp: avgTemp,
            icon: '01d', // Placeholder icon - Stormglass icons aren't standard
            description: getSimpleDescription(avgTemp),
          };
        }).slice(0, 3); // Ensure only 3 days max

      } catch (err) {
        console.error('Error fetching forecast data:', err);
        const stormglassError = (axios.isAxiosError(err) && err.response?.data?.errors)
          ? `Forecast Error: ${JSON.stringify(err.response.data.errors)}`
          : 'Failed to fetch forecast data.';
        fetchError = (fetchError ? fetchError + '; ' : '') + stormglassError;
      }
    }

    // --- Update State ---
    if (fetchError) {
      setError(fetchError);
    }
    if (currentData) {
      setCurrentWeather(currentData);
    }
    if (forecastData.length > 0) {
      setForecast(forecastData);
    }
    // Only set error if BOTH failed or a key was missing
    if (!currentData && forecastData.length === 0 && fetchError) {
      setError(fetchError || 'Failed to fetch any weather data.');
    } else if (fetchError) {
      // Log partial failure but don't block UI if some data loaded
      console.warn("Partial weather fetch failure:", fetchError);
      setError(null); // Clear blocking error if some data is available
    }

    setLoading(false);
  }, [
    openweatherApiKey, 
    stormglassApiKey, 
    loadingOpenWeatherKey, 
    loadingStormGlassKey, 
    openWeatherKeyError, 
    stormGlassKeyError
  ]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { currentWeather, forecast, loading, error };
};

export default useWeather;
