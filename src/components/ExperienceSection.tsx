
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

// Sample data for experience cards
const experiences = [
  {
    id: 1,
    title: "Diani Beach Snorkeling Adventure",
    image: "https://images.unsplash.com/photo-1599687266725-0195e2fd67df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.8,
    reviews: 124,
    price: "$45",
    tags: ["Water Sports", "Adventure"],
    featured: true
  },
  {
    id: 2,
    title: "Colobus Monkey Sanctuary Tour",
    image: "https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.9,
    reviews: 89,
    price: "$30",
    tags: ["Wildlife", "Nature"]
  },
  {
    id: 3,
    title: "Sunset Dhow Cruise with Dinner",
    image: "https://images.unsplash.com/photo-1569254982547-710fe9f466d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
    rating: 4.7,
    reviews: 156,
    price: "$65",
    tags: ["Dining", "Romantic"]
  },
  {
    id: 4,
    title: "Traditional Swahili Cooking Class",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    rating: 4.6,
    reviews: 72,
    price: "$40",
    tags: ["Cultural", "Food"]
  }
];

const ExperienceCard = ({ experience }: { experience: typeof experiences[0] }) => {
  return (
    <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02] duration-300">
      <div className="relative">
        <img 
          src={experience.image} 
          alt={experience.title} 
          className="w-full h-48 object-cover"
        />
        {experience.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-coral text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div className="flex items-center bg-black/70 text-white text-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
            <span>{experience.rating}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-lg mb-2">{experience.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {experience.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">{tag}</Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-bold text-lg">{experience.price}</span>
            <span className="text-gray-500 text-sm"> / person</span>
          </div>
          <Button variant="outline" className="text-ocean border-ocean hover:bg-ocean hover:text-white">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold text-ocean-dark">Popular Experiences</h2>
          <Button variant="link" className="text-ocean">View All Experiences</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
