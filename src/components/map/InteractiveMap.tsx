import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// Map container styles
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px'
};

// Default center coordinates (Diani Beach)
const defaultCenter = {
  lat: -4.2755,
  lng: 39.5950
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

// Interface for location data
interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description?: string;
  image?: string;
}

interface InteractiveMapProps {
  locations?: Location[];
  initialCenter?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (location: Location) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations = [],
  initialCenter = defaultCenter,
  zoom = 13,
  height = '500px',
  onMarkerClick
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Set up map references and handlers
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  // Get marker icon based on location type
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '/images/markers/restaurant.png';
      case 'beach':
        return '/images/markers/beach.png';
      case 'hotel':
        return '/images/markers/hotel.png';
      case 'activity':
        return '/images/markers/activity.png';
      default:
        return '/images/markers/default.png';
    }
  };

  // If there's an error loading the map
  if (loadError) {
    return <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4" style={{ height }}>
      <p className="text-red-500">Error loading map. Please try again later.</p>
    </div>;
  }

  // Display loading state
  if (!isLoaded) {
    return <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4" style={{ height }}>
      <p>Loading map...</p>
    </div>;
  }

  return (
    <div style={{ height, width: '100%' }} className="shadow-md">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
            title={location.name}
            icon={{
              url: getMarkerIcon(location.type),
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
              {selectedLocation.description && (
                <p className="text-sm mt-1">{selectedLocation.description}</p>
              )}
              {selectedLocation.image && (
                <img 
                  src={selectedLocation.image} 
                  alt={selectedLocation.name} 
                  className="mt-2 rounded w-full h-auto max-h-32 object-cover"
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default InteractiveMap; 