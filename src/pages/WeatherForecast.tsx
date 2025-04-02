import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudSun, Thermometer, Droplets, CalendarDays, Info, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const WeatherForecast = () => {
  // Placeholder data - replace with actual data fetching if needed
  const placeholderForecast = [
    { day: 'Today', condition: 'Sunny', temp: '31°C', humidity: '75%', icon: <CloudSun size={20} className="text-yellow-500" /> },
    { day: 'Tomorrow', condition: 'Partly Cloudy', temp: '30°C', humidity: '78%', icon: <CloudSun size={20} className="text-gray-500" /> },
    { day: 'Day After', condition: 'Chance of Showers', temp: '29°C', humidity: '80%', icon: <CloudSun size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Diani Beach Weather</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Stay updated on the tropical climate of Diani. Check the general conditions and a sample forecast below.
      </p>

      <div className="text-center mb-12"> {/* Added container for the button */}
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Info size={24} className="mr-2" />
              Climate Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CalendarDays size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Dry Seasons:</strong> Jan-Mar & Jul-Oct (Ideal beach weather).</span>
              </li>
              <li className="flex items-start">
                <CalendarDays size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Wet Seasons:</strong> Apr-Jun (long rains) & Nov-Dec (short rains). Often afternoon showers.</span>
              </li>
              <li className="flex items-start">
                <Thermometer size={18} className="mr-2 mt-1 text-red-600 flex-shrink-0" />
                <span><strong>Temperatures:</strong> Average 25°C - 32°C year-round.</span>
              </li>
              <li className="flex items-start">
                <Droplets size={18} className="mr-2 mt-1 text-cyan-600 flex-shrink-0" />
                <span><strong>Ocean Temp:</strong> Warm and swimmable all year.</span>
              </li>
            </ul>
             <p className="text-sm text-gray-500 mt-4 italic">
              Always check a reliable source for the latest forecast before your trip.
            </p>
          </CardContent>
        </Card>
        
        {/* Placeholder for a potential live weather widget */}
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-sky-100 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <CloudSun size={24} className="mr-2" />
              Live Weather (Example)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
             <p className="text-6xl font-bold text-ocean-dark mb-2">30°C</p>
             <p className="text-xl text-gray-700 mb-4">Partly Cloudy</p>
             <div className="flex justify-center space-x-4 text-gray-600">
               <span>Humidity: 78%</span>
               <span>Wind: 15 km/h</span>
             </div>
             <p className="text-sm text-gray-500 mt-4 italic">
              (This is placeholder data - integrate a real weather API for live updates)
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-semibold mb-6 text-center text-ocean-dark">Sample 3-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {placeholderForecast.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <CardHeader>
              <CardTitle className="justify-center text-ocean-light">{item.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="text-lg font-medium text-gray-800">{item.condition}</p>
              <p className="text-gray-600"><Thermometer size={14} className="inline mr-1" /> {item.temp}</p>
              <p className="text-gray-600"><Droplets size={14} className="inline mr-1" /> {item.humidity}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
};

export default WeatherForecast;
