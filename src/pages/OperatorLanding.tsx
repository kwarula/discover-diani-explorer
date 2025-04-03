
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, BarChart2, Edit, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react';
import TransportBenefits from '@/components/TransportBenefits';
import TransportOperators from '@/components/TransportOperators';

const OperatorLanding: React.FC = () => {
  // Placeholder data - replace with actual data later
  const testimonials = [
    { id: 1, name: "Aisha Omar", business: "Diani Beach Cafe", quote: "Listing on Discover Diani significantly increased our walk-in customers!", image: "/placeholder.svg" },
    { id: 2, name: "John Mwangi", business: "Ocean Breeze Watersports", quote: "The platform is easy to use and connects us directly with tourists looking for activities.", image: "/placeholder.svg" },
  ];

  const faqItems = [
    { id: "faq1", question: "Who can list a business?", answer: "Any legitimate business operating in the Diani Beach area, including accommodation providers, restaurants, tour operators, shops, transport services, real estate agents, and other local services relevant to tourists and residents." },
    { id: "faq2", question: "What are the fees?", answer: "Currently, creating a basic listing on Discover Diani is free! We may introduce optional premium features or commission models for specific booking integrations in the future, but we promise transparency." },
    { id: "faq3", question: "How long does verification take?", answer: "Verification typically takes 24-48 business hours after you submit all required documents. We'll notify you via email once the process is complete." },
    { id: "faq4", question: "What documents do I need?", answer: "Required documents vary by business type but generally include a valid Business Permit, KRA PIN Certificate, and any relevant tourism or operational licenses. For transport providers, we require a valid driver's license, vehicle insurance, and vehicle registration documents. The onboarding form will specify the exact documents needed for your business category." },
    { id: "faq5", question: "How do I manage inquiries?", answer: "Depending on your listing setup, inquiries may come directly to your provided contact details or through our platform's messaging system (feature coming soon!)." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-r from-ocean-dark via-ocean to-ocean-light text-white py-24 md:py-32 flex items-center justify-center text-center">
        {/* Optional subtle background pattern or image */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Grow Your Diani Business with Discover Diani
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
            Join Diani's premier discovery platform. Showcase your accommodation, activity, restaurant, transport service, or other offering to thousands of tourists and locals.
          </p>
          <Link to="/operator/auth">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-semibold px-8 py-3 text-lg transition-transform transform hover:scale-105">
              Become an Operator
            </Button>
          </Link>
        </div>
      </section>

      {/* Special Transport Section */}
      <TransportBenefits />

      {/* Transport Operators Demo */}
      <TransportOperators />

      {/* 2. Value Proposition / Benefits Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-ocean-dark mb-12">
            Why Partner with Discover Diani?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { icon: Users, title: "Increased Visibility", text: "Reach targeted tourists and locals actively planning their Diani trip." },
              { icon: TrendingUp, title: "Direct Connections", text: "Receive direct inquiries or drive traffic to your own site/location." },
              { icon: Edit, title: "Easy Listing Management", text: "Simple tools to create, update, and showcase your offerings with photos and details." },
              { icon: ShieldCheck, title: "Build Credibility", text: "Benefit from our trusted platform and verification process, enhancing user confidence." },
              { icon: BarChart2, title: "Performance Insights", text: "Understand user engagement with your listing (analytics coming soon)." },
              { icon: CheckCircle, title: "Dedicated Local Focus", text: "Be part of a platform specifically designed to promote Diani Beach businesses." },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <item.icon className="h-10 w-10 text-coral mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-ocean-dark mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-16 md:py-20 bg-ocean-lightest">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-ocean-dark mb-12">
            Getting Started is Easy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { step: 1, title: "Sign Up", text: "Complete the quick operator registration." },
              { step: 2, title: "Create Listing", text: "Add your business details, photos, and services." },
              { step: 3, title: "Get Verified", text: "Submit documents to build trust and safety." },
              { step: 4, title: "Connect!", text: "Go live and reach new customers." },
            ].map((item) => (
               <div key={item.step} className="relative">
                 {/* Connecting line (hidden on last item) */}
                 {item.step < 4 && <div className="hidden md:block absolute top-1/2 left-1/2 w-full h-0.5 bg-coral/30 -translate-y-1/2"></div>}
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-ocean-dark mb-2">{item.title}</h3>
                    <p className="text-gray-600 px-2">{item.text}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Showcase Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-ocean-dark mb-12">
            Tools Designed for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Replace with actual screenshots/mockups */}
            <div className="text-center p-4 border rounded-lg">
              <img src="/placeholder.svg" alt="Dashboard Mockup" className="mx-auto mb-4 w-full h-auto rounded shadow-md"/>
              <h3 className="text-lg font-semibold text-ocean-dark">Intuitive Dashboard</h3>
              <p className="text-gray-600 text-sm">Manage everything in one place.</p>
            </div>
             <div className="text-center p-4 border rounded-lg">
              <img src="/placeholder.svg" alt="Listing Editor Mockup" className="mx-auto mb-4 w-full h-auto rounded shadow-md"/>
              <h3 className="text-lg font-semibold text-ocean-dark">Easy Listing Editor</h3>
              <p className="text-gray-600 text-sm">Update details and photos effortlessly.</p>
            </div>
             <div className="text-center p-4 border rounded-lg">
              <img src="/placeholder.svg" alt="Messaging Mockup" className="mx-auto mb-4 w-full h-auto rounded shadow-md"/>
              <h3 className="text-lg font-semibold text-ocean-dark">Direct Messaging</h3>
              <p className="text-gray-600 text-sm">Connect with customers directly (coming soon).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Proof / Testimonials Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-ocean-dark mb-12">
            Hear From Our Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start space-x-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0"/>
                <div>
                  <p className="text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                  <p className="font-semibold text-ocean-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.business}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-600 md:col-span-2">Become one of our first featured partners!</p>
            )}
          </div>
        </div>
      </section>

      {/* 6. Pricing / Fees Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ocean-dark mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-coral font-semibold mb-6">
            List Your Business for Free!
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get started today with a complimentary listing. We believe in supporting local Diani businesses. Optional premium features may be available in the future.
          </p>
          <Link to="/operator/auth">
            <Button size="lg" variant="outline" className="border-coral text-coral hover:bg-coral hover:text-white font-semibold px-8 py-3 text-lg">
              Create Your Free Listing
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-16 md:py-20 bg-ocean-lightest">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-ocean-dark mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqItems.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="border-b border-ocean/20">
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-ocean-dark">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 8. Final Call to Action Section */}
      <section className="py-16 md:py-24 bg-ocean text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Showcase Your Diani Business?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-white/90">
            Join our growing community of local operators and connect with customers looking for exactly what you offer.
          </p>
          <Link to="/operator/auth">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-semibold px-8 py-3 text-lg transition-transform transform hover:scale-105">
              Become an Operator Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OperatorLanding;
