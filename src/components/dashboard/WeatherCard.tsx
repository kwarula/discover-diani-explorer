
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
    <div className="bg-ocean rounded-xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-white/80">
            {currentDate} • {currentTime}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-center">
            <weatherData.current.icon className="w-10 h-10 mx-auto" />
            <div className="text-2xl font-bold">{weatherData.current.temp}°C</div>
            <div className="text-sm text-white/80">{weatherData.current.condition}</div>
          </div>
          
          <div className="hidden md:block border-l border-white/20 h-14"></div>
          
          <div className="text-sm space-y-1">
            <div>Wind: {weatherData.current.wind}</div>
            <div>Humidity: {weatherData.current.humidity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
