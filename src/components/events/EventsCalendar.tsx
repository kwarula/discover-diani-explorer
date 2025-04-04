import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Users, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { DayProps } from 'react-day-picker';

// Sample events data - in a real app, this would come from an API
const events = [
  {
    id: '1',
    title: 'Diani Beach Festival',
    description: 'Annual beach festival featuring music, food, and local arts & crafts.',
    startDate: new Date(2023, 11, 15, 10, 0), // December 15, 2023
    endDate: new Date(2023, 11, 17, 22, 0),   // December 17, 2023
    location: 'Diani Beach Public Area',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'festival',
    attendees: 1200,
    price: 'Free',
    organizer: 'Diani Tourism Board',
    website: 'https://dianifestival.com',
  },
  {
    id: '2',
    title: 'Sunset Yoga on the Beach',
    description: 'Join us for a relaxing yoga session as the sun sets over the Indian Ocean.',
    startDate: new Date(2023, 11, 10, 17, 30), // December 10, 2023
    endDate: new Date(2023, 11, 10, 19, 0),    // December 10, 2023
    location: 'Kenyaways Beach, Diani',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'wellness',
    attendees: 30,
    price: '$10',
    organizer: 'Diani Beach Wellness',
    website: 'https://dianibeachwellness.com',
  },
  {
    id: '3',
    title: 'Marine Conservation Workshop',
    description: 'Educational workshop on marine life and coral reef conservation efforts.',
    startDate: new Date(2023, 11, 12, 9, 0),  // December 12, 2023
    endDate: new Date(2023, 11, 12, 12, 0),   // December 12, 2023
    location: 'Diani Marine Education Center',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'educational',
    attendees: 45,
    price: 'Free',
    organizer: 'Marine Conservation Kenya',
    website: 'https://marineconservation.ke',
  },
  {
    id: '4',
    title: 'Diani Night Market',
    description: 'Evening market featuring local crafts, food, and entertainment.',
    startDate: new Date(2023, 11, 20, 18, 0), // December 20, 2023
    endDate: new Date(2023, 11, 20, 22, 0),   // December 20, 2023
    location: 'Diani Shopping Center',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'market',
    attendees: 350,
    price: 'Free entry',
    organizer: 'Diani Business Association',
    website: 'https://dianimarket.com',
  },
  {
    id: '5',
    title: 'Kitesurfing Competition',
    description: 'Annual kitesurfing competition featuring pros from around the world.',
    startDate: new Date(2023, 11, 25, 9, 0),  // December 25, 2023
    endDate: new Date(2023, 11, 27, 17, 0),   // December 27, 2023
    location: 'Galu Beach, Diani',
    image: 'https://images.unsplash.com/photo-1525364070330-843b3b91de26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'sports',
    attendees: 500,
    price: 'Free for spectators',
    organizer: 'H2O Extreme Sports',
    website: 'https://dianiwatersports.com',
  },
];

// Event categories
const categories = [
  { id: 'all', label: 'All Events', color: 'bg-gray-500' },
  { id: 'festival', label: 'Festivals', color: 'bg-orange-500' },
  { id: 'wellness', label: 'Wellness', color: 'bg-green-500' },
  { id: 'educational', label: 'Educational', color: 'bg-blue-500' },
  { id: 'market', label: 'Markets', color: 'bg-purple-500' },
  { id: 'sports', label: 'Sports', color: 'bg-red-500' },
];

export default function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get all unique dates with events
  const eventDates = events.map(event => new Date(event.startDate));
  
  // Filter events based on selected date and category
  const filteredEvents = events.filter(event => {
    const dateMatches = selectedDate 
      ? (isSameDay(event.startDate, selectedDate) || 
         isSameDay(event.endDate, selectedDate) ||
         (event.startDate < selectedDate && event.endDate > selectedDate))
      : true;
      
    const categoryMatches = selectedCategory === 'all' || event.category === selectedCategory;
    
    return dateMatches && categoryMatches;
  });
  
  // Get category color
  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };
  
  // Day renderer with event indicators
  const renderDay = (props: DayProps) => {
    const day = props.date;
    const hasEvent = events.some(event => 
      isSameDay(day, event.startDate) || 
      isSameDay(day, event.endDate) || 
      (day > event.startDate && day < event.endDate)
    );
    
    return (
      <div className="relative">
        <div 
          className={cn(
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
            isToday(day) && "bg-ocean/10 text-ocean font-semibold",
            hasEvent && "font-semibold"
          )}
        >
          {format(day, 'd')}
        </div>
        {hasEvent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="h-1 w-1 rounded-full bg-coral"></div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Upcoming <span className="text-ocean">Events</span> in Diani
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what's happening during your stay in Diani Beach. From beach festivals to wellness retreats, there's always something exciting going on.
          </p>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "rounded-full",
                selectedCategory === category.id && category.color
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0 sm:p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  components={{
                    Day: renderDay
                  }}
                />
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-coral mr-1"></span>
                    Dates with events
                  </p>
                  <Button 
                    variant="outline" 
                    className="text-ocean" 
                    onClick={() => setSelectedDate(new Date())}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Today
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Events list */}
          <div className="lg:col-span-2">
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDate && (
                  <h3 className="text-xl font-semibold mb-4">
                    Events {selectedDate && `for ${format(selectedDate, 'MMMM d, yyyy')}`}
                  </h3>
                )}
                
                {filteredEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-40 md:h-auto overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xl font-semibold text-gray-800 mb-1">
                              {event.title}
                            </h4>
                            <Badge className={cn("ml-2", getCategoryColor(event.category))}>
                              {categories.find(cat => cat.id === event.category)?.label}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {format(event.startDate, 'MMM d, yyyy • h:mm a')} - 
                              {isSameDay(event.startDate, event.endDate) 
                                ? format(event.endDate, ' h:mm a') 
                                : format(event.endDate, ' MMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-gray-500 mr-4 mb-2">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.attendees} attendees</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mr-4 mb-2">
                              <Tag className="h-4 w-4 mr-1" />
                              <span>{event.price}</span>
                            </div>
                            
                            <Button asChild size="sm" className="ml-auto mb-2">
                              <Link to={`/events/${event.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are no events scheduled for this date or category. Try selecting a different date or category.
                </p>
                <Button onClick={() => { setSelectedDate(new Date()); setSelectedCategory('all'); }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit event CTA */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Have an event to share?</h3>
              <p className="text-gray-600 max-w-xl">
                Are you organizing an event in Diani? Submit your event details to be featured in our calendar.
              </p>
            </div>
            <Button asChild className="bg-coral hover:bg-coral-dark text-white">
              <Link to="/submit-event">
                Submit Your Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 