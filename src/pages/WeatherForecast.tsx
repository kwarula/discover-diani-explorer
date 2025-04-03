
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudSun, Thermometer, Droplets, CalendarDays, Info, ArrowLeft, Waves } from 'lucide-react'; // Added Waves icon
import { useTideData } from '@/hooks/useTideData'; // Import the tide data hook

const WeatherForecast = () => {
  // Get tide data using our custom hook
  const { tideData, loading, error } = useTideData();
  
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

      {/* New Tide Information Section */}
      <h2 className="text-3xl font-semibold mb-6 text-center text-ocean-dark">Tide Information</h2>
      <div className="mb-12">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Waves size={24} className="mr-2" />
              Diani Beach Tides
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                <p>{error}</p>
                <p className="text-sm mt-2">Check your API configuration or network connection.</p>
              </div>
            ) : (
              <div>
                {tideData && tideData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tideData.map((tide, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tide.type === 'high' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                            <Waves size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{tide.type === 'high' ? 'High Tide' : 'Low Tide'}</p>
                            <p className="text-gray-500">{tide.time}</p>
                            <p className="text-sm text-gray-600">{tide.height} meters</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg mt-4">
                      <h4 className="font-medium text-ocean-dark mb-2">Tide-Dependent Activities:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="bg-ocean-lightest rounded-full p-1 mr-2 mt-0.5">
                            <Waves size={14} className="text-ocean" />
                          </div>
                          <span><strong>Low Tide:</strong> Visit Africa Pool, explore sandbars, observe tide pools</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-ocean-lightest rounded-full p-1 mr-2 mt-0.5">
                            <Waves size={14} className="text-ocean" />
                          </div>
                          <span><strong>High Tide:</strong> Best for swimming, boat trips, and watersports</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>No tide data available at the moment.</p>
                    <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
                  </div>
                )}
              </div>
            )}
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
