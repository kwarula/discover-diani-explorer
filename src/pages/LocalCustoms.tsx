import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Users, Shirt, UtensilsCrossed, Camera, Smile, Building2, Leaf, ArrowLeft, PawPrint, AlertTriangle } from 'lucide-react'; // Added PawPrint, AlertTriangle

const LocalCustoms = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Understanding Local Customs</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Embrace the warm Kenyan hospitality ("Karibu!") by understanding and respecting local customs. It enhances interactions and shows appreciation.
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
              <Handshake size={24} className="mr-2" />
              Greetings & Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Polite Greetings:</strong> Handshake common. "Jambo?" or "Habari?". Basic Swahili appreciated.</span>
              </li>
              <li className="flex items-start">
                <Users size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Respect Elders:</strong> Greet them first, show deference.</span>
              </li>
               <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Indirect Communication:</strong> Be patient and polite.</span>
              </li>
              <li className="flex items-start">
                <Camera size={18} className="mr-2 mt-1 text-purple-600 flex-shrink-0" />
                <span><strong>Photo Permission:</strong> Always ask before taking photos of people.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Shirt size={24} className="mr-2" />
              Dress Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Beachwear:</strong> Acceptable on beaches and within resorts.</span>
              </li>
              <li className="flex items-start">
                <Users size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Public Areas:</strong> Dress modestly (cover shoulders/knees) in towns, markets, villages.</span>
              </li>
              <li className="flex items-start">
                <Users size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Religious Sites:</strong> More conservative dress required (longer clothes, sometimes headscarves).</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <UtensilsCrossed size={24} className="mr-2" />
              Social Etiquette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Handshake size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Right Hand Usage:</strong> Use for eating, handshakes, passing items (traditional).</span>
              </li>
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Bargaining:</strong> Common in markets, do so respectfully. Fixed prices in shops/restaurants.</span>
              </li>
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Patience:</strong> Embrace the relaxed pace ("Pole pole").</span>
              </li>
               <li className="flex items-start">
                <Users size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span><strong>Public Affection:</strong> Keep displays relatively discreet.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <Building2 size={24} className="mr-2" />
              Community Interaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Leaf size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Support Local:</strong> Buy local crafts, eat at local restaurants.</span>
              </li>
              <li className="flex items-start">
                <Leaf size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Responsible Tourism:</strong> Be mindful of environment & respect local traditions.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Wildlife Interactions Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-ocean-light">
              <PawPrint size={24} className="mr-2 text-orange-600" />
              Wildlife Interactions (Monkeys)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Vervet Monkeys:</strong> Common, especially near food areas (restaurants, balconies).</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-red-600 flex-shrink-0" />
                <span><strong>Do NOT Feed:</strong> Feeding encourages dependency and boldness.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-1 text-yellow-600 flex-shrink-0" />
                <span><strong>Secure Food/Belongings:</strong> Monkeys are opportunistic. Don't leave food unattended outdoors.</span>
              </li>
              <li className="flex items-start">
                <Smile size={18} className="mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span><strong>Generally Harmless:</strong> They are usually not aggressive but can be cheeky thieves!</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
        <p className="text-center text-gray-600 mt-12">
          Being mindful of these customs fosters positive interactions and a deeper appreciation for the Kenyan coast's rich culture.
        </p>
    </div>
  );
};

export default LocalCustoms;
