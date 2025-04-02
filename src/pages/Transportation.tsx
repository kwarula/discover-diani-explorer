import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Bus, Bike, Footprints, CarTaxiFront, Info, AlertTriangle, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const Transportation = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Getting Around Diani</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Navigating Diani is easy with various options available. Choose the best fit for your budget, comfort, and destination.
      </p>

      <div className="text-center mb-12"> {/* Added container for the button */}
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <CarTaxiFront size={24} className="mr-2 text-yellow-600" /> {/* Icon for Tuk-Tuks */}
              Tuk-Tuks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>What:</strong> 3-wheeled rickshaws, popular for short trips.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Availability:</strong> Easily flagged down on main roads.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Fares:</strong> Agree *before* journey. Negotiable & affordable.</span>
              </li>
               <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-yellow-600 flex-shrink-0" />
                <span><strong>Safety:</strong> Generally safe; stick to main roads at night.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Car size={24} className="mr-2 text-green-600" />
              Taxis (Cabs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
               <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>What:</strong> Standard cars, more comfort, good for longer distances.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Availability:</strong> Hotels, shopping centers, book via phone/apps (Uber/Bolt may vary).</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Fares:</strong> More expensive. Agree fare or use meter. Hotel taxis often fixed rate.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Bike size={24} className="mr-2 text-red-600" />
              Boda-Bodas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>What:</strong> Motorcycle taxis, quick for solo travelers.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Availability:</strong> Common for shorter distances.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Fares:</strong> Cheaper. Negotiate first.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-red-600 flex-shrink-0" />
                <span><strong>Safety:</strong> Use caution. *Always* insist on a helmet.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Bus size={24} className="mr-2 text-purple-600" />
              Matatus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>What:</strong> Public minibuses on fixed routes (local commuting).</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Experience:</strong> Can be crowded. Authentic but potentially challenging for tourists.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Fares:</strong> Very cheap, fixed fares.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Car size={24} className="mr-2 text-indigo-600" />
              Car Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Availability:</strong> Agencies in Diani & Mombasa Airport.</span>
              </li>
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Requirements:</strong> Valid license (IDP recommended), credit card.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-yellow-600 flex-shrink-0" />
                <span><strong>Considerations:</strong> Drive on left. Varying road conditions. Consider hiring a driver.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Footprints size={24} className="mr-2 text-teal-600" />
              Walking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Info size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Feasibility:</strong> Great along the beach. Possible on main road for short distances (be mindful of traffic).</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
        <p className="text-center text-gray-600 mt-12">
          Choose wisely and enjoy exploring all that Diani has to offer!
        </p>
    </div>
  );
};

export default Transportation;
