import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Sun, AlertTriangle, Waves, Siren, Sprout, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const BeachSafety = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Beach Safety Tips</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Diani Beach is stunning, but safety first! Follow these guidelines to ensure a wonderful and secure experience by the ocean.
      </p>

      <div className="text-center mb-12"> {/* Added container for the button */}
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Waves size={24} className="mr-2" />
              Swimming Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Swim in designated areas:</strong> Look for flags/signs. Avoid strong currents & rocky areas.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Check tide times:</strong> Currents change significantly with tides.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Never swim alone:</strong> Always have a buddy.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-yellow-600 flex-shrink-0" />
                <span><strong>Watch for sea urchins:</strong> Wear water shoes near rocks.</span>
              </li>
              <li className="flex items-start">
                <Siren size={18} className="mr-2 mt-1 text-red-600 flex-shrink-0" />
                <span><strong>Heed lifeguard warnings:</strong> Follow instructions & flags.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Sun size={24} className="mr-2" />
              Sun Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Use high SPF sunscreen:</strong> Apply generously & reapply often.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Wear protective clothing:</strong> Hats, sunglasses, cover-ups.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Stay hydrated:</strong> Drink plenty of water.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Seek shade during peak hours:</strong> Sun is strongest 11 am - 3 pm.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <AlertTriangle size={24} className="mr-2" />
              General Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Secure your belongings:</strong> Don't leave valuables unattended.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Be aware of surroundings:</strong> Stay alert, especially in crowds.</span>
              </li>
              <li className="flex items-start">
                <Sprout size={18} className="mr-2 mt-1 text-teal-600 flex-shrink-0" />
                <span><strong>Respect marine life:</strong> Avoid touching coral & animals.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Know emergency contacts:</strong> Keep local numbers handy.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
      </div>
       <p className="text-center text-gray-600 mt-12">
          By following these simple guidelines, you can enjoy the breathtaking beauty of Diani Beach safely and responsibly.
        </p>
    </div>
  );
};

export default BeachSafety;
