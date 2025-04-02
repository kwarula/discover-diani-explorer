import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, addDays, startOfDay, endOfDay, parseISO } from 'date-fns';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const STORMGLASS_API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;
const LAT = -4.28; // Latitude for Diani Beach
const LON = 39.58; // Longitude for Diani Beach

const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;
const STORMGLASS_URL = 'https://api.stormglass.io/v2/weather/point';

// Define interfaces for the data structures
interface CurrentWeatherData {
  temp: number; // From OpenWeatherMap
  description: string; // From OpenWeatherMap
  icon: string; // From OpenWeatherMap
  humidity: number; // From OpenWeatherMap
  windSpeed: number; // From OpenWeatherMap
  cityName: string; // From OpenWeatherMap
}

interface ForecastDay {
  day: string; // e.g., "Mon"
  temp: number; // Average temp for the day
  icon: string; // Weather icon code (Stormglass doesn't provide standard codes, we might need mapping or use temp)
  description: string; // General condition (derived)
}

interface UseWeatherResult {
  currentWeather: CurrentWeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
}

// Helper to get a simplified description based on Stormglass icon (if available) or temp
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

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast([]);

    let currentData: CurrentWeatherData | null = null;
    let forecastData: ForecastDay[] = [];
    let fetchError: string | null = null;

    // --- Fetch Current Weather (OpenWeatherMap) ---
    if (!OPENWEATHER_API_KEY) {
      fetchError = 'OpenWeatherMap API key is missing.';
    } else {
      try {
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
    if (!STORMGLASS_API_KEY) {
       fetchError = (fetchError ? fetchError + '; ' : '') + 'Stormglass API key is missing.';
    } else {
        const params = 'airTemperature,weatherIcon'; // Request air temp and icon
        const now = new Date();
        const start = startOfDay(addDays(now, 1)).toISOString(); // Start from tomorrow midnight UTC
        const end = endOfDay(addDays(now, 3)).toISOString(); // End 3 days from now midnight UTC

        try {
            const response = await axios.get(STORMGLASS_URL, {
                params: { lat: LAT, lng: LON, params, start, end },
                headers: { Authorization: STORMGLASS_API_KEY },
            });

            const dailyData: { [key: string]: { temps: number[]; icons: number[] } } = {};

            response.data.hours.forEach((hour: any) => {
                const dateStr = format(parseISO(hour.time), 'yyyy-MM-dd');
                if (!dailyData[dateStr]) {
                    dailyData[dateStr] = { temps: [], icons: [] };
                }
                // Stormglass returns temp in Celsius by default
                if (hour.airTemperature?.sg) {
                   dailyData[dateStr].temps.push(hour.airTemperature.sg);
                }
                 // Stormglass weatherIcon is numerical, not useful directly for display
                 // We'll use temperature for description instead.
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
  }, []); // Dependencies: none, fetch on mount

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);


  return { currentWeather, forecast, loading, error };
};

export default useWeather;
