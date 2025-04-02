
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Home, Car, ShoppingBag, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom'; // Import Link

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-coral text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1562280963-8a5475740a10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')"
          }}
        />
        {/* Added text-center to center content */}
        <div className="container mx-auto px-4 relative z-10 text-center"> 
          {/* Added mx-auto to center the block */}
          <div className="max-w-2xl mx-auto"> 
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Diani Marketplace
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover local products, real estate, services, and transport options from trusted providers in Diani Beach.
            </p>
            
            {/* Search and Filter Bar */}
            {/* Added text-left to counteract parent's text-center for the form elements */}
            <div className="bg-white rounded-lg p-4 shadow-lg text-left"> 
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search villas, souvenirs, taxis..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="property">Real Estate</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-coral hover:bg-coral-dark text-white">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Market Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="property" className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto">
              <TabsList className="bg-gray-100 p-1">
                {/* Enhanced active state styling */}
                <TabsTrigger value="property" className="data-[state=active]:bg-ocean data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md">
                  <Home className="mr-2 h-4 w-4" />
                  Real Estate
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-ocean data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-ocean data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="transport" className="data-[state=active]:bg-ocean data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md">
                  <Car className="mr-2 h-4 w-4" />
                  Transport
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Sorting Dropdown Placeholder */}
            <div className="mb-6 flex justify-end">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="property" className="mt-6">
              {/* Add specific filters for Real Estate here later if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((item, index) => (
                  <MarketCard key={index} item={item} type="property" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-6">
              {/* Add specific filters for Products here later if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item, index) => (
                  <MarketCard key={index} item={item} type="product" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
               {/* Add specific filters for Services here later if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item, index) => (
                  <MarketCard key={index} item={item} type="service" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="transport" className="mt-6">
               {/* Add specific filters for Transport here later if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transport.map((item, index) => (
                  <MarketCard key={index} item={item} type="transport" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Verified Vendors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Verified Local Vendors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All listings on Discover Diani are from trusted local vendors who have been verified by our team.
            </p>
          </div>
          
          {/* Updated Vendor Display */}
          <div className="flex flex-wrap justify-center gap-10 mb-10">
            {verifiedVendors.map((vendor) => (
              <div key={vendor.id} className="flex flex-col items-center text-center w-32">
                <img 
                  src={vendor.image || '/placeholder.svg'} // Use placeholder if no image
                  alt={vendor.name} 
                  className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-200" 
                />
                <p className="font-medium text-sm">{vendor.name}</p>
                <div className="flex items-center text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < vendor.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="text-center space-x-4">
             <Button variant="outline" className="text-ocean border-ocean hover:bg-ocean hover:text-white">
                Learn More About Verification
             </Button>
             <Link to="/operator/welcome">
               <Button className="bg-coral hover:bg-coral-dark text-white">
                  Become a Vendor
               </Button>
             </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Market Card Component
const MarketCard = ({ item, type }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
        {type === "property" && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-ocean text-white">{item.type}</Badge>
          </div>
        )}
        {(type === "product" || type === "service" || type === "transport") && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-palm-dark text-white">{item.category}</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg">{item.title}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{item.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{item.location}</span>
        </div>
        {/* Enhanced Price Display */}
        <p className="text-ocean-dark font-bold text-lg mb-3">
          ${item.price.toLocaleString()} 
          {type === "property" && ` ${item.priceType}`} 
          {(type === "product" || type === "service" || type === "transport") && ` ${item.priceUnit}`}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p> {/* Added line-clamp */}
        <Button variant="outline" className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

// Sample Data
const properties = [
  {
    title: "Beachfront Villa",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.9,
    location: "North Diani Beach",
    description: "Luxurious 4-bedroom villa with private beach access, swimming pool, and stunning ocean views.",
    featured: true,
    price: 850000,
    priceType: "USD",
    type: "Sale"
  },
  {
    title: "Ocean View Apartment",
    image: "https://images.unsplash.com/photo-1639661858246-b64400b7b4dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.7,
    location: "Central Diani",
    description: "Modern 2-bedroom apartment with balcony, just a 5-minute walk to the beach. Fully furnished.",
    price: 2500,
    priceType: "USD / month", // Added space for clarity
    type: "Rent"
  },
  {
    title: "Tropical Garden Cottage",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.6,
    location: "South Diani",
    description: "Charming 1-bedroom cottage surrounded by lush tropical gardens. Perfect for a vacation home.",
    price: 120000,
    priceType: "USD",
    type: "Sale"
  }
];

const products = [
  {
    title: "Handcrafted Kikoy Beach Towel",
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.8,
    location: "Diani Craft Market",
    description: "Authentic Kenyan Kikoy fabric beach towel, handwoven locally. Perfect for beach days!",
    featured: true,
    price: 25,
    priceUnit: "USD",
    category: "Handcrafts"
  },
  {
    title: "Coastal Coconut Oil",
    image: "https://images.unsplash.com/photo-1629225460986-a1baef1a123c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.9,
    location: "Local Farmer's Market",
    description: "Organic cold-pressed coconut oil made from local Diani coconuts. Great for cooking and skincare.",
    price: 12,
    priceUnit: "USD",
    category: "Food & Wellness"
  },
  {
    title: "Makonde Wood Carving",
    image: "https://images.unsplash.com/photo-1630694093867-4b947d812bf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.7,
    location: "Ukunda Art Gallery",
    description: "Traditional Makonde sculpture, hand-carved by local artisans. A perfect souvenir from your Diani trip.",
    price: 85,
    priceUnit: "USD",
    category: "Art"
  }
];

const services = [
  {
    title: "Private Dhow Sailing Sunset Cruise",
    image: "https://images.unsplash.com/photo-1543039717-89d0ea1586ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=874&q=80",
    rating: 4.9,
    location: "Diani Beach Waterfront",
    description: "Experience the magic of a Diani sunset aboard a traditional dhow sailing boat. Includes refreshments.",
    featured: true,
    price: 65,
    priceUnit: "USD / person", // Added space
    category: "Tours"
  },
  {
    title: "Full-Day Deep Sea Fishing",
    image: "https://images.unsplash.com/photo-1564857911908-b73619f98319?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=877&q=80",
    rating: 4.8,
    location: "Diani Marine Center",
    description: "Professional deep sea fishing expedition with experienced local guides. All equipment provided.",
    price: 220,
    priceUnit: "USD / person", // Added space
    category: "Adventure"
  },
  {
    title: "In-Villa Massage & Spa Treatment",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.9,
    location: "Your accommodation",
    description: "Relaxing massage and spa treatments in the comfort of your own accommodation. Uses local oils and techniques.",
    price: 80,
    priceUnit: "USD / hour", // Added space
    category: "Wellness"
  }
];

const transport = [
  {
    title: "SGR Transfer: Mombasa to Diani",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=884&q=80",
    rating: 4.7,
    location: "Mombasa Terminus",
    description: "Reliable transfer service from Mombasa SGR station to your accommodation in Diani. Air-conditioned vehicles.",
    featured: true,
    price: 35,
    priceUnit: "USD / person", // Added space
    category: "Airport Transfer"
  },
  {
    title: "Daily TukTuk Rental",
    image: "https://images.unsplash.com/photo-1598966035712-45462dbfbec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=886&q=80",
    rating: 4.6,
    location: "Diani Town Center",
    description: "Explore Diani at your own pace with a private TukTuk for the day. Includes driver and fuel.",
    price: 45,
    priceUnit: "USD / day", // Added space
    category: "Local Transport"
  },
  {
    title: "Bodaboda Motorcycle Taxi",
    image: "https://images.unsplash.com/photo-1625926463389-7609207f2480?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.5,
    location: "Throughout Diani",
    description: "Quick and convenient motorcycle taxi service for short trips around Diani. Helmets provided.",
    price: 5,
    priceUnit: "USD / ride", // Added space
    category: "Local Transport"
  }
];

// Sample Verified Vendor Data (Replace with actual data source later)
const verifiedVendors = [
  { id: 1, name: "Diani Beach Villas", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", rating: 5 },
  { id: 2, name: "Coastal Crafts Co.", image: "https://images.unsplash.com/photo-1599473607947-9283d775f090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", rating: 4 },
  { id: 3, name: "Safari Blue Excursions", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80", rating: 5 },
  { id: 4, name: "Diani Taxi Services", image: "https://images.unsplash.com/photo-1533674689012-7b3b0a43a759?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", rating: 4 },
  { id: 5, name: "Mama Lucy's Kitchen", image: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80", rating: 5 },
];


export default Market;
