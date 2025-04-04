
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark via-ocean to-ocean-light z-0"></div>
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5 z-0 pattern-overlay"
        style={{ 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"
        }}
      ></div>
      
      {/* Decorative element */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M40.5,-62.4C54.1,-56.4,67.8,-47.2,75.3,-34.1C82.8,-21,84.1,-4.1,79.4,10.2C74.8,24.5,64.2,36.2,53.1,47.7C42,59.2,30.3,70.4,16.9,73.8C3.4,77.2,-11.8,72.8,-27.8,67.6C-43.9,62.4,-60.8,56.5,-70,44.5C-79.1,32.5,-80.5,14.5,-78.1,-2.4C-75.7,-19.3,-69.5,-35.2,-59,-47.4C-48.5,-59.7,-33.7,-68.3,-18.8,-71.9C-3.9,-75.6,11.2,-74.3,24.6,-70.7C38.1,-67.1,50,-68.3,40.5,-62.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white">
            Ready to Discover the Magic of Diani Beach?
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-2xl mx-auto">
            Create your free account today and start planning your perfect Diani Beach experience with personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className="bg-white hover:bg-white/90 text-ocean-dark font-medium text-lg px-8 py-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link to="/register">
                Get Started For Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild size="lg" className="bg-white text-ocean-dark hover:bg-white/90 font-medium text-lg px-8 py-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
