import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import ExperienceSection from '@/components/ExperienceSection';
import TestimonialSection from '@/components/TestimonialSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import { InteractiveMap } from '@/components/map';
import { ActivitiesShowcase } from '@/components/activities';
import { PlanYourTrip } from '@/components/trip';
import { EventsCalendar } from '@/components/events';

// Sample location data for Diani Beach
const dianiLocations = [
  {
    id: '1',
    name: 'Diani Beach',
    lat: -4.2755,
    lng: 39.5950,
    type: 'beach',
    description: 'Beautiful white sandy beach with crystal clear waters.',
    image: '/images/locations/diani-beach.jpg'
  },
  {
    id: '2',
    name: 'The Sands at Nomad',
    lat: -4.2865,
    lng: 39.5915,
    type: 'hotel',
    description: 'Luxury beachfront hotel with excellent amenities.',
  },
  {
    id: '3',
    name: 'Ali Barbour\'s Cave Restaurant',
    lat: -4.3005,
    lng: 39.5800,
    type: 'restaurant',
    description: 'Unique dining experience in a natural coral cave.',
  },
  {
    id: '4',
    name: 'Colobus Conservation',
    lat: -4.3542,
    lng: 39.5678,
    type: 'activity',
    description: 'Conservation center for the endangered colobus monkeys.',
  },
  {
    id: '5',
    name: 'Kongo River Golf Course',
    lat: -4.2982,
    lng: 39.5845,
    type: 'activity',
    description: '18-hole golf course with beautiful ocean views.',
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeatureSection />
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Diani Beach</h2>
          <div className="h-[600px]">
            <InteractiveMap 
              locations={dianiLocations} 
              zoom={14}
              height="100%"
            />
          </div>
        </div>
      </div>
      <ActivitiesShowcase />
      <PlanYourTrip />
      <ExperienceSection />
      <EventsCalendar />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Landing;
