import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Hotel, Banknote, HeartPulse, Briefcase, CheckCircle, ArrowLeft, CarTaxiFront, Ship, Wallet } from 'lucide-react'; // Replaced Ferry with Ship

const TravelTips = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Diani Travel Tips</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Planning a trip to Diani? Make it smooth and memorable with these essential tips covering everything from arrival to packing.
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
              <Plane size={24} className="mr-2" />
              Getting There
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Flights:</strong> Nearest airport is Ukunda (UKA). Alternative: Mombasa (MBA) + transfer (1.5-2h).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Transfers:</strong> Arrange airport transfers in advance with hotel or taxi service.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Hotel size={24} className="mr-2" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Variety:</strong> Wide range from luxury resorts to budget guesthouses.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Booking:</strong> Book in advance, especially during peak seasons (Dec-Mar, Jul-Aug).</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Banknote size={24} className="mr-2" />
              Money Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Currency:</strong> Kenyan Shilling (KES).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>ATMs & Forex:</strong> Available in town/shopping centers. Major cards accepted widely.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Tipping:</strong> Customary for good service (~10% in restaurants, small amounts elsewhere).</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <HeartPulse size={24} className="mr-2" />
              Health & Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Vaccinations:</strong> Consult your doctor. Yellow Fever may be required.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Malaria:</strong> Use repellent, consider antimalarials (consult doctor).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Drinking Water:</strong> Bottled or purified water only.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Food Safety:</strong> Eat at reputable places, cautious with street food.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Briefcase size={24} className="mr-2" />
              Packing Essentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
              <li>Lightweight clothing (cotton, linen)</li>
              <li>Swimwear</li>
              <li>Sunscreen, hat, sunglasses</li>
              <li>Insect repellent</li>
              <li>Comfortable shoes/sandals</li>
              <li>Basic first-aid kit</li>
              <li>Camera</li>
              <li>Adapter (Type G - UK style)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Transport Tips Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <CarTaxiFront size={24} className="mr-2 text-yellow-600" />
              Transport Tips & Fares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Negotiate First:</strong> Always agree on fares *before* starting with Tuk-tuks/Boda-bodas.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Estimated Fares (Tuk-tuk):</strong> Ukunda-Beach: 200-400 KSh, Beach-Kongo River: 300-500 KSh, Short hops: 100-200 KSh.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Taxis:</strong> More expensive, better for groups/distance. Confirm fare/meter.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Apps:</strong> Ride-hailing (Uber/Bolt) availability varies. Check locally.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Likoni Ferry Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Ship size={24} className="mr-2 text-blue-600" /> {/* Replaced Ferry with Ship */}
              Likoni Ferry (Mombasa)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Context:</strong> Connects Mombasa Island to the South Coast (road to Diani).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Crowds:</strong> Can be very crowded, especially during morning/evening commute times.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Safety:</strong> Be aware of surroundings and belongings in crowds.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Alternatives:</strong> Fly directly to Ukunda (UKA), arrange private transfer (more costly but avoids ferry).</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Budget Travel Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Wallet size={24} className="mr-2 text-purple-600" />
              Diani on a Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Hostels:</strong> Available, often around 2000-2500 KSh/night. Check listings.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Cheap Eats:</strong> Look for local eateries ('kibandas') away from main tourist spots for affordable meals.</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Free Activities:</strong> Enjoy the beach, swim, walk, explore local markets (window shopping!).</span>
              </li>
               <li className="flex items-start">
                <CheckCircle size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Transport:</strong> Use Tuk-tuks/Boda-bodas for short trips, negotiate fares. Consider Matatus for longer routes if adventurous.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
        <p className="text-center text-gray-600 mt-12">
          Have an incredible and well-prepared trip to Diani Beach!
        </p>
    </div>
  );
};

export default TravelTips;
