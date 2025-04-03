
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

// Mock data - would be replaced with real API calls in production
const transportOperators = {
  tuktuk: [
    {
      id: 'tt1',
      name: 'Joseph',
      photo: '/placeholder.svg',
      vehiclePhoto: '/placeholder.svg',
      description: 'Friendly rides around Beach Road',
      whatsapp: '+254712345678',
      phone: '+254712345678',
      rating: 4.7,
    },
    {
      id: 'tt2',
      name: 'David',
      photo: '/placeholder.svg',
      vehiclePhoto: '/placeholder.svg',
      description: 'Quick trips to Ukunda Town',
      whatsapp: '+254723456789',
      phone: '+254723456789',
      rating: 4.5,
    },
  ],
  bodaboda: [
    {
      id: 'bb1',
      name: 'Samuel',
      photo: '/placeholder.svg',
      vehiclePhoto: '/placeholder.svg',
      description: 'Fast delivery and transport services',
      whatsapp: '+254734567890',
      phone: '+254734567890',
      rating: 4.8,
    },
  ],
  taxi: [
    {
      id: 'tx1',
      name: 'George',
      photo: '/placeholder.svg',
      vehiclePhoto: '/placeholder.svg',
      description: 'Airport transfers & day trips',
      whatsapp: '+254745678901',
      phone: '+254745678901',
      rating: 4.9,
    },
  ],
};

const TransportOperators: React.FC = () => {
  const openWhatsApp = (number: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}, I found you on Discover Diani. Are you available for a ride?`);
    window.open(`https://wa.me/${number.replace('+', '')}?text=${message}`, '_blank');
  };

  const callOperator = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-center text-ocean-dark mb-8">
        Find Verified Transport
      </h2>
      
      <Tabs defaultValue="tuktuk" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="tuktuk">Tuk-tuk</TabsTrigger>
          <TabsTrigger value="bodaboda">Boda-boda</TabsTrigger>
          <TabsTrigger value="taxi">Car Hire/Taxi</TabsTrigger>
        </TabsList>
        
        {Object.entries(transportOperators).map(([category, operators]) => (
          <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {operators.map(operator => (
              <Card key={operator.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={operator.photo} 
                      alt={`${operator.name}'s profile`} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{operator.name}'s {category === 'tuktuk' ? 'Tuk-tuk' : category === 'bodaboda' ? 'Moto' : 'Taxi'}</h3>
                      <div className="flex items-center text-amber-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(operator.rating) ? "text-amber-500" : "text-gray-300"}>★</span>
                        ))}
                        <span className="ml-1 text-gray-600">{operator.rating}</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={operator.vehiclePhoto} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{operator.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 gap-2 flex flex-col sm:flex-row">
                  <Button 
                    className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 gap-2"
                    onClick={() => openWhatsApp(operator.whatsapp, operator.name)}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm6.042 16.971c-.269.826-1.338 1.86-2.304 2.11-1.012.267-2.338.249-3.661-.149-1.822-.546-3.843-1.781-5.739-3.677-1.896-1.896-3.131-3.917-3.677-5.739-.398-1.323-.416-2.649-.149-3.661.25-.966 1.283-2.035 2.11-2.304.705-.229 1.379-.103 1.87.214.445.289.808.742 1.15 1.427.343.686.571 1.46.639 1.76.079.343.057.675-.006.948-.079.343-.29.626-.502.852-.212.226-.36.353-.573.614-.212.26-.173.521-.026.825.147.303.639 1.193 1.376 2.033.916 1.035 1.648 1.393 2.033 1.572.485.225.833.16 1.108-.107.274-.263.516-.57.674-.8.243-.348.578-.465.917-.38.339.084 1.78.833 2.088.993.308.16.516.26.59.404.074.147.074.547-.195 1.088z"/>
                    </svg>
                    Chat on WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => callOperator(operator.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TransportOperators;
