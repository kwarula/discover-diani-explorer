import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Operator } from '@/types/database';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Phone, Mail, Clock, Star, ArrowLeft, Building, UserCheck } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

const OperatorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperator = async () => {
      if (!id) {
        setError("Operator ID not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('operators')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error("Operator not found.");

        setOperator(data);
      } catch (err: any) {
        console.error("Error fetching operator details:", err);
        setError(err.message || "Failed to load operator details.");
        setOperator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="w-full h-64" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="md:col-span-1 space-y-4">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Operator Profile</h2>
          <p className="text-gray-600 mb-6">{error || "The requested operator could not be found."}</p>
          <Button asChild variant="outline">
            <Link to="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const coverPhotoUrl = operator.cover_photo_url || '/placeholder.svg';
  const logoUrl = operator.logo_url || undefined;
  const fallbackName = operator.business_name?.substring(0, 2).toUpperCase() || 'OP';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/transportation">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transportation
            </Link>
          </Button>
        </div>

        <div className="relative mb-8">
          <AspectRatio ratio={16 / 5} className="bg-muted rounded-lg overflow-hidden">
            <img src={coverPhotoUrl} alt={`${operator.business_name} cover photo`} className="object-cover w-full h-full" />
          </AspectRatio>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <Avatar className="h-24 w-24 border-4 border-background bg-background">
              <AvatarImage src={logoUrl} alt={operator.business_name ?? 'Operator Logo'} />
              <AvatarFallback className="text-xl">{fallbackName}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark">{operator.business_name}</h1>
              <VerifiedBadge isVerified={operator.is_verified} />
            </div>

            {operator.business_type && <Badge variant="outline">{operator.business_type}</Badge>}

            {operator.specialties && operator.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {operator.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
              </div>
            )}

            {operator.description && (
              <div className="prose max-w-none pt-4 border-t">
                <h2 className="text-2xl font-semibold mb-3">About {operator.business_name}</h2>
                <p>{operator.description}</p>
              </div>
            )}

            {operator.key_offerings && operator.key_offerings.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-2">Key Offerings</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {operator.key_offerings.map((offering, index) => <li key={index}>{offering}</li>)}
                </ul>
              </div>
            )}

            {/* TODO: Add Operator's Listings Section */}
            {/* <div className="pt-4 border-t">
              <h3 className="text-xl font-semibold mb-2">Listings by this Operator</h3>
              ... Fetch and display listings where user_id matches operator.user_id ...
            </div> */}

            {/* TODO: Add Operator Reviews Section if applicable */}
            {/* <div className="pt-6 border-t">
              <ReviewList reviews={reviews} isLoading={reviewLoading} error={reviewError} />
            </div> */}
            {/* TODO: Add Operator Review Form if applicable */}

          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Contact & Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {operator.contact_person_name && (
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-muted-foreground" />
                    <span>Contact: {operator.contact_person_name}</span>
                  </div>
                )}
                {operator.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <a href={`tel:${operator.contact_phone}`} className="text-ocean hover:underline">{operator.contact_phone}</a>
                  </div>
                )}
                {operator.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <a href={`mailto:${operator.contact_email}`} className="text-ocean hover:underline">{operator.contact_email}</a>
                  </div>
                )}
                {operator.address_area && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-muted-foreground mt-0.5" />
                    <span>{operator.address_street && `${operator.address_street}, `}{operator.address_area}</span>
                  </div>
                )}
                {operator.operating_hours && (
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-muted-foreground mt-0.5" />
                    <span className="whitespace-pre-line">{String(operator.operating_hours)}</span>
                  </div>
                )}
                {operator.service_area_description && (
                  <div className="flex items-start gap-2 pt-2 border-t">
                    <Building size={16} className="text-muted-foreground mt-0.5" />
                    <span>Service Area: {operator.service_area_description}</span>
                  </div>
                )}
                {/* TODO: Add Map if coordinates exist */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OperatorDetailPage;
