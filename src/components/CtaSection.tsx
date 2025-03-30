
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-20 bg-ocean text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80')"
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Discover the Magic of Diani Beach?
          </h2>
          
          <p className="text-xl mb-8 text-white/90">
            Create your free account today and start planning your perfect Diani Beach experience with personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-ocean hover:bg-white/90 font-medium text-lg">
              <Link to="/register">
                Get Started For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20 font-medium text-lg">
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
