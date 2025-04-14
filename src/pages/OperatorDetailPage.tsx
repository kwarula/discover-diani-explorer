import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Operator } from '@/types/supabase';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Calendar, Clock, ChevronLeft, Star, MessageCircle, Share2 } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const OperatorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        if (!id) {
          setError('No operator ID provided');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('operators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setOperator(data);
          
          // Fetch gallery images
          const { data: galleryData, error: galleryError } = await supabase
            .from('operator_gallery_media')
            .select('media_url')
            .eq('operator_id', id)
            .order('sort_order', { ascending: true });
            
          if (galleryError) {
            console.error('Error fetching gallery:', galleryError);
          } else if (galleryData) {
            const images = galleryData.map(item => item.media_url);
            setGalleryImages(images);
          }
        }
      } catch (err: any) {
        console.error('Error fetching operator:', err);
        setError(err.message || 'Failed to load operator details');
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: operator?.business_name || 'Operator Details',
        text: `Check out ${operator?.business_name} on Discover Diani`,
        url: window.location.href,
      })
      .catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success('Link copied to clipboard');
        })
        .catch((err) => {
          console.error('Error copying to clipboard:', err);
          toast.error('Failed to copy link');
        });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-600">{error || 'Operator not found'}</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/operators">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Operators
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Prepare images array for gallery
  const allImages = [
    ...(operator.cover_photo_url ? [operator.cover_photo_url] : []),
    ...galleryImages
  ];

  return (
    <>
      <Helmet>
        <title>{operator.business_name} | Discover Diani</title>
        <meta name="description" content={operator.description || `Details about ${operator.business_name}`} />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        {/* Back button and actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/operators">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Operators
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Gallery and details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="mb-6">
              <ImageGallery 
                images={allImages.length > 0 ? allImages : ['/placeholder-business.jpg']} 
                className="aspect-video"
              />
            </div>

            {/* Tabs for details, services, reviews */}
            <Tabs defaultValue="about" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <h2 className="text-xl font-semibold mb-3">About {operator.business_name}</h2>
                <p className="text-gray-700 mb-6">{operator.description || 'No description provided.'}</p>
                
                {operator.key_offerings && operator.key_offerings.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2">Key Offerings</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {operator.key_offerings.map((offering, index) => (
                        <Badge key={index} variant="secondary">{offering}</Badge>
                      ))}
                    </div>
                  </>
                )}
                
                {operator.specialties && operator.specialties.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {operator.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </>
                )}
                
                <h3 className="text-lg font-medium mb-2">Service Area</h3>
                <p className="text-gray-700 mb-6">{operator.service_area_description || 'Diani Beach area'}</p>
              </TabsContent>
              
              <TabsContent value="services" className="mt-4">
                <h2 className="text-xl font-semibold mb-3">Services</h2>
                {operator.categories && operator.categories.length > 0 ? (
                  <div className="space-y-4">
                    {operator.categories.map((category, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {operator.price_range ? `Price range: ${operator.price_range}` : 'Contact for pricing'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specific services listed. Please contact the operator for details.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <Button size="sm">Write a Review</Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review {operator.business_name}!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Contact info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{operator.business_name}</h2>
                {operator.is_verified && <VerifiedBadge />}
              </div>
              
              <div className="flex items-center mb-2">
                <Badge variant="outline">{operator.business_type}</Badge>
                {operator.status === 'active' && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">
                      {[
                        operator.address_street,
                        operator.address_area,
                        operator.address_city,
                        operator.address_country
                      ].filter(Boolean).join(', ') || 'Diani Beach, Kenya'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${operator.contact_phone}`} className="text-sm text-blue-600 hover:underline">
                      {operator.contact_phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${operator.contact_email}`} className="text-sm text-blue-600 hover:underline">
                      {operator.contact_email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm text-gray-600">
                      {operator.operating_hours ? 
                        'Custom hours (see details)' : 
                        'Contact for availability'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {new Date(operator.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <Button className="w-full">Contact Now</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorDetailPage;
