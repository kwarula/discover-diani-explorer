
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Calendar, Utensils, Waves, Users } from "lucide-react";

const features = [
  {
    title: "Personalized Recommendations",
    description: "Get tailored suggestions based on your preferences and interests.",
    icon: Compass,
    color: "text-ocean",
    bgColor: "bg-ocean/10"
  },
  {
    title: "Interactive Maps",
    description: "Navigate easily with detailed maps highlighting the best spots in Diani.",
    icon: MapPin,
    color: "text-coral",
    bgColor: "bg-coral/10"
  },
  {
    title: "Events Calendar",
    description: "Stay updated with local events, festivals, and activities happening during your stay.",
    icon: Calendar,
    color: "text-palm",
    bgColor: "bg-palm/10"
  },
  {
    title: "Dining Guide",
    description: "Discover the best restaurants and cafes that match your dietary preferences.",
    icon: Utensils,
    color: "text-ocean-dark",
    bgColor: "bg-ocean-dark/10"
  },
  {
    title: "Beach Activities",
    description: "Find the perfect water sports and beach activities for your adventure level.",
    icon: Waves,
    color: "text-sand-dark",
    bgColor: "bg-sand-dark/10"
  },
  {
    title: "Local Experiences",
    description: "Connect with authentic cultural experiences and community-based tourism.",
    icon: Users,
    color: "text-coral-dark",
    bgColor: "bg-coral-dark/10"
  }
];

// Import cn from lib/utils instead of defining locally
import { cn } from "@/lib/utils";

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
        
        {/* Updated Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" // Added flex flex-col
            >
              {/* Adjusted Padding and Structure */}
              <CardContent className="p-6 flex-grow flex flex-col items-start"> 
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4", // Smaller icon container
                  feature.color, 
                  feature.bgColor
                )}>
                  <feature.icon size={24} /> {/* Smaller icon */}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3> {/* Use h3 for semantics */}
                <p className="text-gray-600 text-sm flex-grow">{feature.description}</p> {/* Smaller text, flex-grow */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

// Removed redundant local cn function
