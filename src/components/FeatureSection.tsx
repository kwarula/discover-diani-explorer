
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Calendar, Utensils, Waves, Users } from "lucide-react";

const features = [
  {
    title: "Personalized Recommendations",
    description: "Get tailored suggestions based on your preferences and interests.",
    icon: Compass,
    color: "text-ocean",
    bgColor: "bg-ocean/10",
    large: true
  },
  {
    title: "Interactive Maps",
    description: "Navigate easily with detailed maps highlighting the best spots in Diani.",
    icon: MapPin,
    color: "text-coral",
    bgColor: "bg-coral/10",
    large: false
  },
  {
    title: "Events Calendar",
    description: "Stay updated with local events, festivals, and activities happening during your stay.",
    icon: Calendar,
    color: "text-palm",
    bgColor: "bg-palm/10",
    large: false
  },
  {
    title: "Dining Guide",
    description: "Discover the best restaurants and cafes that match your dietary preferences.",
    icon: Utensils,
    color: "text-ocean-dark",
    bgColor: "bg-ocean-dark/10",
    large: false
  },
  {
    title: "Beach Activities",
    description: "Find the perfect water sports and beach activities for your adventure level.",
    icon: Waves,
    color: "text-sand-dark",
    bgColor: "bg-sand-dark/10",
    large: true
  },
  {
    title: "Local Experiences",
    description: "Connect with authentic cultural experiences and community-based tourism.",
    icon: Users,
    color: "text-coral-dark",
    bgColor: "bg-coral-dark/10",
    large: false
  }
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ocean-dark via-ocean to-ocean-light mb-4">
            Your Perfect Diani Experience
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Discover everything Diani has to offer with our personalized features designed to make your trip unforgettable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={cn(
                "border-none hover-lift overflow-hidden glass-card",
                feature.large ? "md:col-span-8" : "md:col-span-4"
              )}
            >
              <CardHeader className="pb-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.color} ${feature.bgColor} mb-6`}>
                  <feature.icon size={32} />
                </div>
                <CardTitle className="text-2xl font-display text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

// Helper function to conditionally join classNames
function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
