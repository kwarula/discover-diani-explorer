
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link first
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useMarketListings, MarketListing } from '@/hooks/useMarketListings'; // Import hook and type
import { useVerifiedVendors, VerifiedVendor } from '@/hooks/useVerifiedVendors'; // Import hook and type
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Home, Car, ShoppingBag, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // State for hero category filter
  const [activeTab, setActiveTab] = useState<string>('property'); // State for active tab
  const [sortBy, setSortBy] = useState<string>('newest'); // State for sorting option

  // Fetch listings based on active tab, search, and sort
  const { 
    listings, 
    loading: listingsLoading, 
    error: listingsError 
    // refetch: refetchListings // Optional: get refetch function if needed
  } = useMarketListings({ 
    category: activeTab === 'all' ? null : activeTab, // Pass active tab as category
    searchQuery: searchQuery || null, 
    sortBy: sortBy as 'newest' | 'price-asc' | 'price-desc' | 'rating' | null, // Type assertion
  });

  // Fetch verified vendors
  const { 
    vendors, 
    loading: vendorsLoading, 
    error: vendorsError 
    // refetch: refetchVendors // Optional: get refetch function if needed
  } = useVerifiedVendors({ limit: 6 }); // Fetch 6 vendors

  // --- Handler Functions ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Hook refetches automatically due to dependency change
  };

  const handleSearchSubmit = () => {
    // Primarily for UX or if specific action needed on button click
    console.log("Searching for:", searchQuery, "in category:", categoryFilter);
    // Set active tab based on the filter dropdown selection when search is clicked
    if (categoryFilter !== 'all') {
      setActiveTab(categoryFilter);
    }
    // Hook will refetch due to state changes (searchQuery or activeTab)
  };
  
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    // Don't change activeTab here, wait for search submit or tab click
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset category filter dropdown if a tab is explicitly clicked? Optional.
    // setCategoryFilter('all'); 
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // --- Rendering Helpers ---

  // Helper function to render listing cards or skeletons
  const renderListingCards = (items: MarketListing[]) => {
    if (listingsLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-[350px] w-full rounded-lg" /> // Adjust height
      ));
    }
    if (listingsError) {
      return <p className="text-red-500 col-span-full">Error loading listings: {listingsError.message}</p>;
    }
    if (!items || items.length === 0) {
      return <p className="text-gray-500 col-span-full">No listings found matching your criteria.</p>;
    }
    // Ensure items is an array before mapping
    if (!Array.isArray(items)) {
       console.error("renderListingCards received non-array:", items);
       return <p className="text-red-500 col-span-full">Error displaying listings.</p>;
    }
    return items.map((item) => (
      // Use Link to wrap the card for navigation (adjust props later)
      <Link to={`/market/listing/${item.id}`} key={item.id} className="block"> 
         <MarketCard item={item} type={item.category || 'unknown'} /> 
      </Link>
    ));
  };

  // Helper function to render vendor cards or skeletons
  const renderVendorCards = (vendorItems: VerifiedVendor[]) => {
     if (vendorsLoading) {
       return Array.from({ length: 6 }).map((_, index) => (
         <div key={index} className="flex flex-col items-center text-center w-32">
            <Skeleton className="w-20 h-20 rounded-full mb-3" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-20" />
         </div>
       ));
     }
     if (vendorsError) {
       return <p className="text-red-500">Error loading vendors: {vendorsError.message}</p>;
     }
     if (!vendorItems || vendorItems.length === 0) {
       return <p className="text-gray-500">No verified vendors found.</p>;
     }
     // Ensure vendorItems is an array
     if (!Array.isArray(vendorItems)) {
        console.error("renderVendorCards received non-array:", vendorItems);
        return <p className="text-red-500">Error displaying vendors.</p>;
     }
     return vendorItems.map((vendor) => (
        <div key={vendor.id} className="flex flex-col items-center text-center w-32">
          <img 
            src={vendor.logo_url || '/placeholder.svg'} // Use logo_url
            alt={vendor.business_name} // Use business_name
            className="w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-200" 
          />
          <p className="font-medium text-sm">{vendor.business_name}</p>
          <div className="flex items-center text-yellow-400 mt-1">
            {/* Use calculated average_rating (placeholder for now) */}
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(vendor.average_rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      ));
  };

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
                    onChange={handleSearchChange} // Use handler
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                   {/* Connect Category Select */}
                  <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}> 
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
                 {/* Connect Search Button */}
                <Button onClick={handleSearchSubmit} className="bg-coral hover:bg-coral-dark text-white">
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
           {/* Connect Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto">
              <TabsList className="bg-gray-100 p-1">
                {/* Add 'all' tab maybe? For now, keep categories */}
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

            {/* Connect Sorting Dropdown */}
            <div className="mb-6 flex justify-end">
              <Select value={sortBy} onValueChange={handleSortChange}>
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
            
            {/* Use renderListingCards helper for all tabs */}
            <TabsContent value="property" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderListingCards(listings)}
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {renderListingCards(listings)}
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {renderListingCards(listings)}
              </div>
            </TabsContent>
            
            <TabsContent value="transport" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {renderListingCards(listings)}
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
          
          {/* Use renderVendorCards helper */}
          <div className="flex flex-wrap justify-center gap-10 mb-10">
             {renderVendorCards(vendors)}
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

// --- Market Card Component ---
// Update props to use MarketListing type
interface MarketCardProps {
  item: MarketListing;
  type: string; // category ('property', 'product', 'service', 'transport') or potentially 'unknown'
}

const MarketCard: React.FC<MarketCardProps> = ({ item, type }) => {
  // Use the first image from the images array, or a placeholder
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '/placeholder.svg';
  // Determine the specific type for property listings (Sale/Rent) - needs schema adjustment or logic
  // For now, we'll just use the category passed in as 'type'
  const displayType = type === 'property' ? item.sub_category || 'Property' : item.category; // Example: Use sub_category if available for property

  return (
    // Card itself is wrapped by Link in the parent component
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"> 
      <div className="relative h-48 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
          // Add error handling for images if needed
          onError={(e) => (e.currentTarget.src = '/placeholder.svg')} 
        />
        {item.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
        {type === "property" && (
          <div className="absolute top-2 left-2">
            {/* Use displayType derived above */}
            <Badge className="bg-ocean text-white">{displayType}</Badge> 
          </div>
        )}
        {(type === "product" || type === "service" || type === "transport") && item.category && (
          <div className="absolute top-2 left-2">
             {/* Use item.category directly here */}
            <Badge className="bg-palm-dark text-white">{item.category}</Badge>
          </div>
        )}
      </div>
      {/* Make CardContent grow to fill remaining space */}
      <CardContent className="p-5 flex flex-col flex-grow"> 
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg flex-grow pr-2">{item.title}</h3>
           {/* Use average_rating from hook */}
          <div className="flex items-center text-sm flex-shrink-0">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            {/* Display calculated average rating */}
            <span>{item.average_rating?.toFixed(1) ?? 'N/A'}</span> 
          </div>
        </div>
        {/* Removed extra closing </div> tag here */}
        {item.location && ( // Only show location if available
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span>{item.location}</span>
          </div>
        )}
        {/* Price Display - Handle null price */}
        <p className="text-ocean-dark font-bold text-lg mb-3">
          {item.price !== null && item.price !== undefined 
            ? `$${item.price.toLocaleString()}` 
            : 'Price not available'}
          {/* Use price_unit from hook data */}
          {item.price_unit && ` ${item.price_unit}`} 
        </p>
         {/* Use description from hook data */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{item.description || 'No description available.'}</p>
         {/* Button is part of the card, but navigation is handled by the Link wrapping the card */}
        <Button 
           variant="outline" 
           className="w-full text-ocean border-ocean hover:bg-ocean hover:text-white mt-auto flex-shrink-0"
           // Prevent button click from interfering with Link navigation if necessary
           onClick={(e) => e.preventDefault()} 
         >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

// Sample Data - REMOVED (Data now comes from hooks)
/*
const properties = [ ... ];
const products = [ ... ];
const services = [ ... ];
const transport = [ ... ];
const verifiedVendors = [ ... ];
*/

export default Market;
