
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "London, UK",
    text: "Discover Diani made our Kenya trip so much easier! The personalized recommendations were spot on, and we discovered hidden gems we would have missed otherwise.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Toronto, Canada",
    text: "As a solo traveler, this app was my perfect companion. The local insights and safety tips gave me confidence to explore Diani fully.",
    rating: 5
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    location: "New Delhi, India",
    text: "The restaurant recommendations matched our dietary preferences perfectly. We loved every meal we had in Diani thanks to this app!",
    rating: 4
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    location: "Sydney, Australia",
    text: "The beach activity recommendations were perfect for our family. The kids loved the beginner water sports suggestions!",
    rating: 5
  },
  {
    id: 5,
    name: "Olivia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    location: "Madrid, Spain",
    text: "The cultural experiences suggested by the app were authentic and respectful. I felt like I truly connected with the local culture.",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="h-full glass-card hover-lift border-none">
      <CardContent className="p-8">
        <div className="flex gap-4 items-center mb-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback className="bg-coral text-white">{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-display font-bold text-lg text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
          </div>
        </div>
        
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={18} 
              className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
            />
          ))}
        </div>
        
        <p className="text-gray-600 italic text-lg leading-relaxed">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral-dark via-coral to-coral-light mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Don't just take our word for it — hear from travelers who have explored Diani with our guide.
          </p>
        </div>
        
        <div className="px-4 md:px-12">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-10 gap-4">
              <CarouselPrevious className="relative static left-0 translate-y-0 rounded-full h-10 w-10 bg-white border border-gray-200" />
              <CarouselNext className="relative static right-0 translate-y-0 rounded-full h-10 w-10 bg-white border border-gray-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
