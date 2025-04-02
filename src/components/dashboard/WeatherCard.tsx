import React from 'react';
import { CloudSun, Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from 'lucide-react'; // Keep some icons for fallback/loading
import useWeather from '@/hooks/useWeather'; // Import the hook
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Remove the old WeatherData interface

interface WeatherCardProps {
  // Remove weatherData prop
  currentDate: string; // Keep these props
  currentTime: string;
  userName: string;
}

const WeatherCard = ({ currentDate, currentTime, userName }: WeatherCardProps) => {
  // Destructure the updated return value from the hook
  const { currentWeather, forecast, loading, error } = useWeather();

  const getGradientClass = () => {
    const hour = new Date().getHours(); // Get current hour (0-23)

    if (hour >= 5 && hour < 12) { // Morning (5am - 11:59am)
      return 'from-sky-400 via-sky-300 to-blue-400'; // Lighter blue/sky gradient
    } else if (hour >= 12 && hour < 17) { // Afternoon (12pm - 4:59pm)
      return 'from-blue-500 via-blue-400 to-cyan-400'; // Standard bright blue
    } else if (hour >= 17 && hour < 20) { // Evening (5pm - 7:59pm)
      return 'from-orange-400 via-red-400 to-purple-500'; // Sunset gradient
    } else { // Night (8pm - 4:59am)
      return 'from-indigo-800 via-gray-900 to-slate-900'; // Dark night gradient
    }
  };

  const gradientClass = getGradientClass();

  // --- Loading State ---
  if (loading) {
    return (
      <div className={`bg-gradient-to-r ${gradientClass} rounded-2xl p-8 text-white mb-10 shadow-lg overflow-hidden relative`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div className="mb-6 md:mb-0">
             <Skeleton className="h-10 w-64 mb-3 bg-white/20" />
             <Skeleton className="h-6 w-48 bg-white/20" />
          </div>
          <div className="flex items-center space-x-8 glass-card p-4 rounded-xl bg-white/10">
             <Skeleton className="w-14 h-14 rounded-full bg-white/20" />
             <div className="hidden md:block border-l border-white/20 h-16"></div>
             <div className="space-y-2">
               <Skeleton className="h-6 w-24 bg-white/20" />
               <Skeleton className="h-6 w-24 bg-white/20" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  // Check for error OR if loading is finished but we have no current weather data
  if (error || (!loading && !currentWeather)) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-2xl p-8 text-white mb-10 shadow-lg overflow-hidden relative">
        <div className="relative z-10 text-center">
          <h2 className="text-xl font-semibold mb-2">Weather Unavailable</h2>
          {/* Display specific error or a generic message */}
          <p className="text-sm text-white/80">{error || 'Could not load current weather data.'}</p>
          <p className="text-xs mt-2 text-white/60">Please check your API key or network connection.</p>
        </div>
      </div>
    );
  }

  // --- Success State (assuming currentWeather is available after loading/error checks) ---
  // Use currentWeather for the main display
  const weatherIconUrl = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;

  return (
    <div className={`bg-gradient-to-r ${gradientClass} rounded-2xl p-8 text-white mb-10 shadow-lg overflow-hidden relative`}>
      {/* Decorative wave pattern */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M43.5,-74.3C55,-66.6,62.5,-52.4,69.1,-38.2C75.7,-24,81.4,-9.8,79.1,2.3C76.9,14.5,66.6,24.6,58.1,35.9C49.5,47.2,42.8,59.6,32.2,67.4C21.5,75.2,7.1,78.4,-5.4,74.9C-17.9,71.5,-28.6,61.4,-38.4,51.8C-48.3,42.2,-57.3,33.2,-63.5,21.8C-69.7,10.4,-73,-3.2,-72.1,-17.2C-71.3,-31.1,-66.3,-45.3,-56.3,-53.7C-46.4,-62.1,-31.5,-64.7,-17.8,-70.7C-4.1,-76.8,8.5,-86.3,22.8,-84.9C37.1,-83.6,52,-82.1,43.5,-74.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Welcome back, {userName}!
          </h1>
          <p className="text-white/90 text-lg">
            {currentDate} • {currentTime} • {currentWeather.cityName}
          </p>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-8 glass-card p-4 rounded-xl bg-white/10">
          {/* Weather Icon and Temp */}
          <div className="text-center animate-float">
             <img src={weatherIconUrl} alt={currentWeather.description} className="w-14 h-14 mx-auto" />
            <div className="text-3xl font-bold mt-1">{currentWeather.temp}°C</div>
            <div className="text-sm text-white/90 capitalize">{currentWeather.description}</div>
          </div>

          {/* Separator */}
          <div className="hidden md:block border-l border-white/20 h-16"></div>

          {/* Wind and Humidity */}
          <div className="text-base sm:text-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Wind size={20} className="text-white/80" />
              <span>{currentWeather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets size={20} className="text-white/80" />
              <span>{currentWeather.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini forecast - Re-added using the forecast data */}
      {forecast && forecast.length > 0 && (
        <div className="hidden lg:flex justify-around mt-8 bg-white/10 rounded-xl p-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center px-2">
              <div className="font-medium">{day.day}</div>
              {/* Placeholder icon - replace if Stormglass provides usable icons or map temps */}
              <Sun size={24} className="mx-auto my-1 text-yellow-300" />
              <div className="text-xl font-bold">{day.temp}°</div>
              <div className="text-xs text-white/80 capitalize">{day.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
