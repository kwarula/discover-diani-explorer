
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Activities', path: '/activities' },
    { name: 'Market', path: '/market' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "navbar-scrolled py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className={cn(
              "text-xl font-display font-bold transition-colors duration-300",
              isScrolled ? "text-ocean-dark" : "text-white"
            )}>
              Discover Diani
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-coral relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300",
                  isActive(link.path) 
                    ? isScrolled ? "text-coral after:w-full after:bg-coral" : "text-coral after:w-full after:bg-coral"
                    : isScrolled ? "text-gray-800" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu, Dark Mode Toggle, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={cn(
                "rounded-full",
                isScrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/20"
              )}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <div className="hidden md:block">
              <UserMenu />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                isScrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/20"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mt-2 mx-4 overflow-hidden">
          <div className="py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "block py-2 px-5 text-base font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-coral/10 text-coral"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 pb-3 border-t border-gray-200 mt-2">
              <div className="px-5">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
