
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Calendar, Utensils, Waves, Users } from "lucide-react";

const features = [
  {
    title: "Personalized Recommendations",
    description: "Get tailored suggestions based on your preferences and interests.",
    icon: Compass,
    color: "text-ocean"
  },
  {
    title: "Interactive Maps",
    description: "Navigate easily with detailed maps highlighting the best spots in Diani.",
    icon: MapPin,
    color: "text-coral"
  },
  {
    title: "Events Calendar",
    description: "Stay updated with local events, festivals, and activities happening during your stay.",
    icon: Calendar,
    color: "text-palm"
  },
  {
    title: "Dining Guide",
    description: "Discover the best restaurants and cafes that match your dietary preferences.",
    icon: Utensils,
    color: "text-ocean-dark"
  },
  {
    title: "Beach Activities",
    description: "Find the perfect water sports and beach activities for your adventure level.",
    icon: Waves,
    color: "text-sand-dark"
  },
  {
    title: "Local Experiences",
    description: "Connect with authentic cultural experiences and community-based tourism.",
    icon: Users,
    color: "text-coral-dark"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ocean-dark mb-4">
            Your Perfect Diani Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover everything Diani has to offer with our personalized features designed to make your trip unforgettable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color} bg-gray-100 mb-4`}>
                  <feature.icon size={24} />
                </div>
                <CardTitle className="text-xl font-display text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
