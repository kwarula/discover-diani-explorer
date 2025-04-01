
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:py-32 bg-palm-dark text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')"
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Diani Beach Blog
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90 mb-8">
            Stories, guides, and insights to help you make the most of your Diani Beach experience
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Travel Tips</Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Local Culture</Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Beach Life</Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Wildlife</Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">Food & Dining</Badge>
          </div>
        </div>
      </section>
      
      {/* Featured Article */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-lg overflow-hidden h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                alt="Featured Article" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Badge className="bg-coral text-white mb-4">Featured</Badge>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                The Ultimate Guide to Diani Beach: Kenya's Coastal Paradise
              </h2>
              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>May 15, 2023</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>12 min read</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>Sarah Johnson</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Discover everything you need to know about planning the perfect trip to Diani Beach, from the best time to visit and top activities to local transportation tips and hidden gems that most tourists miss.
              </p>
              <Button className="bg-palm hover:bg-palm-dark text-white">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white p-1">
                <TabsTrigger value="recent" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                  Recent Posts
                </TabsTrigger>
                <TabsTrigger value="travel" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                  Travel Tips
                </TabsTrigger>
                <TabsTrigger value="culture" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                  Local Culture
                </TabsTrigger>
                <TabsTrigger value="wildlife" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                  Wildlife
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="recent" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <BlogCard key={index} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="travel" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.filter(post => post.category === "Travel Tips").map((post, index) => (
                  <BlogCard key={index} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="culture" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.filter(post => post.category === "Local Culture").map((post, index) => (
                  <BlogCard key={index} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="wildlife" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.filter(post => post.category === "Wildlife").map((post, index) => (
                  <BlogCard key={index} post={post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-ocean bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-ocean-dark mb-4">
              Stay Updated with Diani News
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest blog posts, local events, and exclusive travel tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
              />
              <Button className="bg-ocean hover:bg-ocean-dark text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ post }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5 flex-1">
        <Badge className={`mb-3 ${getCategoryColor(post.category)}`}>
          {post.category}
        </Badge>
        <h3 className="font-display font-semibold text-lg mb-2">{post.title}</h3>
        <div className="flex items-center text-gray-500 text-xs space-x-3 mb-3">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Button variant="link" className="p-0 h-auto text-ocean hover:text-ocean-dark">
          Read More
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to get category color
const getCategoryColor = (category) => {
  switch (category) {
    case "Travel Tips":
      return "bg-coral text-white";
    case "Local Culture":
      return "bg-palm text-white";
    case "Wildlife":
      return "bg-ocean text-white";
    case "Beach Life":
      return "bg-ocean-light text-ocean-dark";
    default:
      return "bg-gray-600 text-white";
  }
};

// Sample Data
const blogPosts = [
  {
    title: "Top 10 Water Activities You Must Try in Diani Beach",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    date: "June 3, 2023",
    readTime: 8,
    author: "Michael Roberts",
    category: "Travel Tips",
    excerpt: "From snorkeling in coral reefs to kitesurfing the waves, here are ten incredible water activities that will make your Diani Beach trip unforgettable."
  },
  {
    title: "Understanding Swahili Culture: A Visitor's Guide",
    image: "https://images.unsplash.com/photo-1535912076172-a89afd92e222?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    date: "May 21, 2023",
    readTime: 10,
    author: "Lisa Mwangi",
    category: "Local Culture",
    excerpt: "Learn about the rich Swahili culture of Kenya's coast, from traditional customs and greetings to food and music that make the region unique."
  },
  {
    title: "The Endangered Colobus Monkeys of Diani",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    date: "April 15, 2023",
    readTime: 6,
    author: "David Thompson",
    category: "Wildlife",
    excerpt: "Discover the story of Diani's black and white colobus monkeys, the conservation efforts to protect them, and how you can contribute."
  },
  {
    title: "Best Beach Bars and Restaurants in Diani",
    image: "https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    date: "April 3, 2023",
    readTime: 7,
    author: "Emma Wilson",
    category: "Travel Tips",
    excerpt: "Our curated guide to the most scenic and delicious beachfront dining options where you can enjoy fresh seafood with your toes in the sand."
  },
  {
    title: "Sacred Kaya Forests: Ancient Mijikenda Heritage",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "March 18, 2023",
    readTime: 9,
    author: "John Kimani",
    category: "Local Culture",
    excerpt: "Explore the cultural and ecological significance of the sacred Kaya forests near Diani, recognized as UNESCO World Heritage sites."
  },
  {
    title: "Marine Life Guide: What You'll See While Snorkeling",
    image: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    date: "February 27, 2023",
    readTime: 8,
    author: "Sarah Johnson",
    category: "Wildlife",
    excerpt: "A visual guide to the colorful fish, coral species, and other marine creatures you might encounter in Diani's thriving underwater ecosystem."
  }
];

export default Blog;
