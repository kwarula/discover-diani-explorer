
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import ExperienceSection from '@/components/ExperienceSection';
import TestimonialSection from '@/components/TestimonialSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeatureSection />
      <ExperienceSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Landing;
