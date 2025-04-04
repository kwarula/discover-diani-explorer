// Update beginning of file to fix env access
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { PointOfInterest } from '@/types/database';
import { usePOI, getCategoryName, getCategoryIcon } from '@/hooks/usePOI';

// Fix: Access environment variable directly
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; // Added fallback

const MAP_CONTAINER_STYLE = {
  height: '400px',
  width: '100%'
};

const POIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: poi, isLoading, isError } = usePOI(id);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !poi) {
    return (
      <div className="text-center text-red-500 min-h-screen">
        Error: Could not load point of interest.
      </div>
    );
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = !showFullDescription && poi.description.length > 200
    ? poi.description.substring(0, 200) + '...'
    : poi.description;

  const categoryName = getCategoryName(poi.category);
  const categoryIcon = getCategoryIcon(poi.category);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container mx-auto mt-8 px-4 md:px-8 lg:px-12">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            {poi.image_urls && poi.image_urls.length > 0 ? (
              <img
                src={poi.image_urls[0]}
                alt={poi.name}
                className="w-full h-64 object-cover object-center"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                No Image Available
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="uppercase text-xs font-bold">{categoryName}</Badge>
            </div>
          </div>

          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">{poi.name}</CardTitle>
            <CardDescription className="text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{poi.latitude}, {poi.longitude}</span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">
                {truncatedDescription}
                {poi.description.length > 200 && (
                  <Button variant="link" onClick={toggleDescription} className="p-0">
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </p>
            </div>

            {poi.access_notes && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Access Notes</h3>
                <p className="text-gray-600">{poi.access_notes}</p>
              </div>
            )}

            {poi.best_visit_time && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Best Time to Visit</h3>
                <p className="text-gray-600">{poi.best_visit_time}</p>
              </div>
            )}

            {poi.entrance_fee && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Entrance Fee</h3>
                <p className="text-gray-600">{poi.entrance_fee}</p>
              </div>
            )}

            {poi.history && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">History</h3>
                <p className="text-gray-600">{poi.history}</p>
              </div>
            )}

            {poi.significance && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Significance</h3>
                <p className="text-gray-600">{poi.significance}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
          {GOOGLE_MAPS_API_KEY ? (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={{ lat: poi.latitude, lng: poi.longitude }}
                zoom={15}
              >
                <Marker position={{ lat: poi.latitude, lng: poi.longitude }} />
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="text-red-500">
              Google Maps API key is required to display the map.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default POIDetail;
