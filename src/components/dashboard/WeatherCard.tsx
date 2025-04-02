
import React from 'react';
import { CloudSun } from 'lucide-react';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: typeof CloudSun;
    wind: string;
    humidity: string;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface WeatherCardProps {
  weatherData: WeatherData;
  currentDate: string;
  currentTime: string;
  userName: string;
}

const WeatherCard = ({ weatherData, currentDate, currentTime, userName }: WeatherCardProps) => {
  return (
    <div className="bg-gradient-to-r from-ocean via-ocean-light to-ocean rounded-2xl p-8 text-white mb-10 shadow-lg overflow-hidden relative">
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
            {currentDate} • {currentTime}
          </p>
        </div>
        
        <div className="flex items-center space-x-8 glass-card p-4 rounded-xl">
          <div className="text-center animate-float">
            <weatherData.current.icon className="w-14 h-14 mx-auto text-white" />
            <div className="text-3xl font-bold mt-2">{weatherData.current.temp}°C</div>
            <div className="text-sm text-white/90">{weatherData.current.condition}</div>
          </div>
          
          <div className="hidden md:block border-l border-white/20 h-16"></div>
          
          <div className="text-lg space-y-2">
            <div className="flex items-center"><span className="w-24 text-white/80">Wind:</span> {weatherData.current.wind}</div>
            <div className="flex items-center"><span className="w-24 text-white/80">Humidity:</span> {weatherData.current.humidity}</div>
          </div>
        </div>
      </div>
      
      {/* Mini forecast - visible on larger screens */}
      <div className="hidden lg:flex justify-between mt-8 bg-white/10 rounded-xl p-4">
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="text-center px-4">
            <div className="font-medium">{day.day}</div>
            <div className="text-2xl font-bold">{day.temp}°</div>
            <div className="text-sm text-white/80">{day.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
