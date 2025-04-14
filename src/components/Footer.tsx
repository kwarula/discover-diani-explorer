import React from 'react';
import { Facebook, Instagram, Twitter, Mail, PhoneCall, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-ocean-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold">Discover Diani</h3>
            <p className="text-sm text-gray-300">
              Your personal guide to exploring the beautiful beaches and attractions of Diani Beach, Kenya.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-coral-light transition-colors" 
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-coral-light transition-colors"
                aria-label="Visit our Instagram profile"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-coral-light transition-colors"
                aria-label="Visit our Twitter profile"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <nav aria-label="Footer navigation - Quick links">
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/explore" className="text-gray-300 hover:text-white transition-colors">Explore</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/market" className="text-gray-300 hover:text-white transition-colors">Market</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </nav>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <nav aria-label="Footer navigation - Resources">
              <ul className="space-y-2">
                <li><Link to="/beach-safety" className="text-gray-300 hover:text-white transition-colors">Beach Safety</Link></li>
                <li><Link to="/travel-tips" className="text-gray-300 hover:text-white transition-colors">Travel Tips</Link></li>
                <li><Link to="/weather-forecast" className="text-gray-300 hover:text-white transition-colors">Weather Forecast</Link></li>
                <li><Link to="/local-customs" className="text-gray-300 hover:text-white transition-colors">Local Customs</Link></li>
                <li><Link to="/transportation" className="text-gray-300 hover:text-white transition-colors">Transportation</Link></li>
              </ul>
            </nav>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@discoverdiani.com" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-white group"
                  aria-label="Email us at info@discoverdiani.com"
                >
                  <Mail size={16} className="group-hover:text-coral-light" />
                  <span>info@discoverdiani.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+254123456789" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-white group"
                  aria-label="Call us at +254 123 456 789"
                >
                  <PhoneCall size={16} className="group-hover:text-coral-light" />
                  <span>+254 123 456 789</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://goo.gl/maps/TQh8UWkfuXZMKgdZ8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white group"
                  aria-label="View our location on Google Maps"
                >
                  <ExternalLink size={16} className="group-hover:text-coral-light" />
                  <span>Google Maps Location</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Discover Diani. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-xs">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
