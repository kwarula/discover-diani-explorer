import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Tag, Info, Clock, DollarSign, UserCheck, ArrowLeft, Landmark } from 'lucide-react'; // Add relevant icons

const PoiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get POI ID from URL

  const [poi, setPoi] = useState<Tables<'points_of_interest'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch POI Details
  useEffect(() => {
    const fetchPoi = async () => {
      if (!id) {
        setError("Point of Interest ID not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch POI data using 'as any' to bypass table name type check issue
        const { data, error: dbError } = await supabase
          .from('points_of_interest' as any) // Re-adding workaround for persistent type issue
          .select('*') // Select all columns for detail view
          .eq('id', id) // Match the ID from the URL
          .single(); // Expecting only one POI

        // Check for error *before* asserting type
        if (dbError) throw dbError;
        if (!data) throw new Error("Point of Interest not found.");

        // Use explicit assertion as type inference seems unreliable here
        setPoi(data as Tables<'points_of_interest'>);
      } catch (err: any) {
        console.error("Error fetching POI details:", err);
        setError(err.message || "Failed to load Point of Interest details.");
        setPoi(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPoi();
  }, [id]);


  // --- Render Logic ---

  if (loading) {
    // Basic Skeleton Loader
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="w-full h-96 mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !poi) {
    // Error Display
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex-grow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Point of Interest</h2>
          <p className="text-gray-600 mb-6">{error || "The requested Point of Interest could not be found."}</p>
          <Button asChild variant="outline">
            <Link to="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Display POI Details ---
  const imageUrl = poi.image_urls?.[0] || poi.images?.[0] || '/placeholder.svg'; // Use image_urls or images

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex-grow">
         {/* Back Button */}
         <div className="mb-6">
           <Button asChild variant="outline" size="sm">
             <Link to="/explore?tab=poi"> {/* Link back to Explore page, POI tab */}
               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Points of Interest
             </Link>
           </Button>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image & Key Info */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark">{poi.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {poi.category && <Badge variant="outline"><Landmark size={14} className="mr-1"/> {poi.category}</Badge>}
              {poi.featured && <Badge variant="secondary" className="bg-coral text-white">Featured</Badge>}
              {/* Add location display if available/relevant */}
              {poi.latitude && poi.longitude && (
                 <span className="flex items-center"><MapPin size={14} className="mr-1" /> Diani Area (Approx.)</span>
              )}
            </div>

            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
              <img src={imageUrl} alt={poi.name ?? 'Point of Interest image'} className="object-cover w-full h-full" />
            </AspectRatio>

            {/* Description */}
            {poi.description && (
                <div className="prose max-w-none">
                    <h2 className="text-2xl font-semibold mb-3">Description</h2>
                    <p>{poi.description}</p>
                </div>
            )}

            {/* History / Significance */}
            {(poi.history || poi.significance) && (
                <div className="prose max-w-none pt-4 border-t">
                    <h2 className="text-2xl font-semibold mb-3">History & Significance</h2>
                    <p>{poi.history || poi.significance}</p>
                </div>
            )}

             {/* TODO: Add Gallery Section if multiple images in image_urls/images */}

          </div>

          {/* Right Column: Practical Info Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Visitor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                 {poi.access_notes && (
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{poi.access_notes}</span>
                    </div>
                 )}
                 {poi.entrance_fee && (
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-muted-foreground" />
                        <span>Entrance Fee: {poi.entrance_fee}</span>
                    </div>
                 )}
                 {poi.best_visit_time && (
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>Best Time to Visit: {poi.best_visit_time}</span>
                    </div>
                 )}
                 {poi.guide_required !== null && ( // Check for null explicitly
                    <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-muted-foreground" />
                        <span>Guide Required: {poi.guide_required ? 'Yes' : 'No'}</span>
                    </div>
                 )}
                 {/* Add link to map if coordinates exist */}
                 {poi.latitude && poi.longitude && (
                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`} target="_blank" rel="noopener noreferrer">
                            <MapPin size={14} className="mr-2" /> View on Map
                        </a>
                    </Button>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoiDetailPage;
