
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Info, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-ocean-dark text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')"
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            About Discover Diani
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90">
            Your ultimate companion for exploring the pristine beaches and vibrant culture of Diani, Kenya
          </p>
        </div>
      </section>
      
      {/* About Diani Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-ocean-dark mb-6">
                Diani Beach: A Tropical Paradise
              </h2>
              <p className="text-gray-700 mb-4">
                Located on Kenya's South Coast, Diani Beach is renowned worldwide for its pristine white sands, crystal-clear turquoise waters, and vibrant coral reefs. Stretching over 17 kilometers, this award-winning beach offers visitors an unparalleled coastal experience.
              </p>
              <p className="text-gray-700 mb-4">
                Beyond its natural beauty, Diani is home to diverse wildlife, including the endangered Angolan Colobus monkeys, and is surrounded by lush tropical forests and mangroves that add to its ecological significance.
              </p>
              <p className="text-gray-700">
                The warm, friendly local community embraces visitors with traditional Swahili hospitality, making everyone feel welcome in this slice of paradise.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                alt="Diani Beach panorama" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We're dedicated to helping travelers discover the best of Diani Beach through personalized, local insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center text-coral mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gray-800">Local Expertise</h3>
              <p className="text-gray-600">
                Our recommendations come from locals and experienced travelers who know Diani's hidden gems.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-ocean/20 flex items-center justify-center text-ocean mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gray-800">Personalized Experience</h3>
              <p className="text-gray-600">
                We tailor recommendations to your preferences, ensuring your Diani experience is uniquely yours.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-palm/20 flex items-center justify-center text-palm mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gray-800">Community Support</h3>
              <p className="text-gray-600">
                We promote responsible tourism that benefits local communities and preserves Diani's natural beauty.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Have questions about Diani Beach or need assistance with our platform? We're here to help!
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-ocean-dark">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-coral mt-1" size={20} />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">Diani Beach Road, Diani, Kenya</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Info className="text-ocean mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@discoverdiani.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="text-palm mt-1" size={20} />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-gray-600">Mon-Fri: 9AM - 5PM EAT</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-ocean-dark">Follow Us</h3>
                <p className="text-gray-600 mb-4">
                  Stay updated with the latest from Diani Beach on our social media channels.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center text-white hover:bg-ocean-dark transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center text-white hover:bg-ocean-dark transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center text-white hover:bg-ocean-dark transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="bg-coral hover:bg-coral-dark text-white font-medium">
                <Link to="/register">
                  Join Discover Diani Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
