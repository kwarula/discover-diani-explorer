
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Map, 
  Calendar, 
  ShoppingBag, 
  Compass, 
  MessageCircle,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center text-white font-bold">
              DD
            </div>
            <span className="text-xl font-display font-bold text-ocean-dark hidden md:inline-block">
              Discover Diani
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-ocean-dark hover:text-ocean font-medium">Home</Link>
            <Link to="/explore" className="text-ocean-dark hover:text-ocean font-medium">Explore</Link>
            <Link to="/activities" className="text-ocean-dark hover:text-ocean font-medium">Activities</Link>
            <Link to="/market" className="text-ocean-dark hover:text-ocean font-medium">Market</Link>
            <Link to="/blog" className="text-ocean-dark hover:text-ocean font-medium">Blog</Link>
            <Button className="bg-ocean hover:bg-ocean-dark text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center p-3 space-x-4 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} className="text-ocean" />
              <span>Home</span>
            </Link>
            <Link 
              to="/explore" 
              className="flex items-center p-3 space-x-4 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Compass size={20} className="text-ocean" />
              <span>Explore</span>
            </Link>
            <Link 
              to="/activities" 
              className="flex items-center p-3 space-x-4 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Calendar size={20} className="text-ocean" />
              <span>Activities</span>
            </Link>
            <Link 
              to="/market" 
              className="flex items-center p-3 space-x-4 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={20} className="text-ocean" />
              <span>Market</span>
            </Link>
            <Link 
              to="/blog" 
              className="flex items-center p-3 space-x-4 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={20} className="text-ocean" />
              <span>Blog</span>
            </Link>
            
            <div className="pt-2">
              <Button 
                className="w-full bg-ocean hover:bg-ocean-dark text-white"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
