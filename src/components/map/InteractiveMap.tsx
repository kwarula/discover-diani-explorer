import React, { useState, useCallback, useRef } from 'react'; // Removed useEffect
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { AlertTriangle, Loader2 } from 'lucide-react'; // Added Loader2
import { useGoogleMaps } from '@/contexts/GoogleMapsContext'; // Import the custom hook

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
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null); // Keep mapError state
  
  // Consume the context to get loading status
  const { isLoaded, loadError } = useGoogleMaps(); 

  // Set up map references and handlers
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
    
    // Verify the map loaded correctly
    try {
      if (map && map.getDiv()) {
        // Map is accessible and rendered
        // No need for setLoadingMarkers anymore
        // setMapError check can remain if needed for specific map instance issues
      } else {
        setMapError("Map instance failed to render properly");
      }
    } catch (err) {
      setMapError("Error accessing map instance");
      console.error("Map instance access error:", err);
    }
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
    const iconMap: Record<string, string> = {
      restaurant: '/images/markers/restaurant.png',
      beach: '/images/markers/beach.png',
      hotel: '/images/markers/hotel.png',
      activity: '/images/markers/activity.png'
    };
    
    // Check if the type exists in our icon map
    return iconMap[type] || '/images/markers/default.png';
  };

  // If there's an error loading the script or initializing the map instance
  const combinedError = loadError ? loadError.message : mapError;
  if (combinedError) {
    return (
      <div className="bg-red-50 rounded-lg flex flex-col items-center justify-center p-6" style={{ height }}>
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-red-700 font-medium text-center">
          {combinedError || "Error loading map."}
        </p>
        {/* Keep API key hint if loadError exists */}
        {loadError && (
          <p className="text-red-600 text-sm mt-2">
            Check API key (VITE_GOOGLE_MAPS_API_KEY) and network connection.
          </p>
        )}
      </div>
    );
  }

  // Display loading state using context's isLoaded
  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4" style={{ height }}>
         <Loader2 className="h-8 w-8 animate-spin text-ocean-light" />
      </div>
    );
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
              scaledSize: window.google && window.google.maps ? new window.google.maps.Size(32, 32) : undefined
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/placeholder.jpg';
                  }}
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
