import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroSearch } from "@/components/search";

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube video background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ transform: `translateY(${scrollPosition * 0.2}px)` }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <iframe 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] min-w-[100%] min-h-[100%] object-cover"
            src="https://www.youtube.com/embed/tDkyN-TnXJI?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=tDkyN-TnXJI"
            title="Diani Beach Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Fallback image in case video doesn't load */}
        <img 
          src="https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80" 
          alt="Diani Beach" 
          className="hidden w-full h-full object-cover" 
        />
      </div>
      
      {/* Gradient overlay - more modern and vibrant */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-0"></div>
      
      {/* Content */}
      <div 
        className="relative z-10 container mx-auto px-4 text-center text-white"
        style={{ transform: `translateY(${scrollPosition * -0.1}px)` }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 animate-slide-down text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-sand-light">
          Discover <span className="text-coral-light">Diani</span> Beach
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 animate-slide-down font-light" style={{ animationDelay: '0.2s' }}>
          Your personal guide to Kenya's most beautiful coastal paradise
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up mb-8" style={{ animationDelay: '0.4s' }}>
          <Button asChild size="lg" className="bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral text-white font-medium text-lg transition-all duration-300 transform hover:scale-105">
            <Link to="/register">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button asChild size="lg" className="bg-white text-ocean-dark hover:bg-white/90 font-medium text-lg transition-all duration-300 transform hover:scale-105">
            <Link to="/explore">
              Explore Diani
            </Link>
          </Button>
        </div>
        
        {/* Add the new search component */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <HeroSearch />
        </div>
      </div>
      
      {/* Wave decoration with subtle animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 wave-animation">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white" preserveAspectRatio="none">
          <path d="M0,96L60,90.7C120,85,240,75,360,69.3C480,64,600,64,720,74.7C840,85,960,107,1080,112C1200,117,1320,107,1380,101.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
