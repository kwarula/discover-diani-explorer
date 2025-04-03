
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, Users, MapPin, DollarSign, Clock } from 'lucide-react';

const TransportBenefits = () => {
  return (
    <section className="py-16 md:py-20 bg-ocean-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-3 px-4 py-1 text-base bg-coral hover:bg-coral">Transport Providers</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ocean-dark mb-4">
            Get More Rides in Diani!
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Connect directly with tourists & locals needing transport. Join Discover Diani's trusted riders network today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct WhatsApp Contact</h3>
              <p className="text-gray-600">
                Get your WhatsApp number listed, allowing tourists to contact you directly. No middleman, no commission fees!
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Trust with Verification</h3>
              <p className="text-gray-600">
                The "Verified" badge shows customers you're trusted and reliable, making them more likely to choose your service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-amber-500">
            <CardContent className="pt-6">
              <div className="bg-amber-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reach New Customers</h3>
              <p className="text-gray-600">
                Access tourists and locals actively looking for transport on our platform. Grow your customer base effortlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500">
            <CardContent className="pt-6">
              <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based Visibility</h3>
              <p className="text-gray-600">
                Get noticed by customers in your preferred operating area. Perfect for tuk-tuk and boda-boda operators.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-500">
            <CardContent className="pt-6">
              <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Listing</h3>
              <p className="text-gray-600">
                Getting verified and listed is completely free! No hidden fees or commissions to worry about.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-teal-500">
            <CardContent className="pt-6">
              <div className="bg-teal-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Verification Process</h3>
              <p className="text-gray-600">
                Submit your ID, license, and vehicle photos easily through our platform. Get verified quickly and start receiving ride requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TransportBenefits;
