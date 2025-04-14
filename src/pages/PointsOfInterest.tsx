
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { InfoWindowF } from '@react-google-maps/api';
import { InfoWindowState } from '@/lib/types';
import { usePOIs, getCategoryIcon } from '@/hooks/usePOI';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: -4.2767,
  lng: 39.5867,
};

const zoom = 13;

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const getMarkerIcon = (category: string) => {
  switch (category) {
    case 'historical_site':
      return '/icons/historical_site.svg';
    case 'natural_feature':
      return '/icons/natural_feature.svg';
    case 'cultural_site':
      return '/icons/cultural_site.svg';
    case 'conservation_site':
      return '/icons/conservation_site.svg';
    case 'viewpoint':
      return '/icons/viewpoint.svg';
    case 'beach_area':
      return '/icons/beach_area.svg';
    default:
      return '/icons/map-pin.svg';
  }
};

const PointsOfInterest = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });
  const { data: pois, isLoading, error } = usePOIs();
  const navigate = useNavigate();

  const [infoWindow, setInfoWindow] = useState<InfoWindowState>({
    isOpen: false,
    position: null,
    content: null,
  });

  const handleMarkerClick = (poi: any) => {
    setInfoWindow({
      isOpen: true,
      position: { lat: poi.latitude || 0, lng: poi.longitude || 0 },
      content: (
        <div>
          <h3 className="font-bold text-lg">{poi.name}</h3>
          <p>{poi.description}</p>
          <Button variant="link" onClick={() => navigate(`/poi/${poi.id}`)}>
            Learn More <MapPin className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    });
  };

  const handleInfoWindowClose = () => {
    setInfoWindow({
      isOpen: false,
      position: null,
      content: null,
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  // Fix: Convert error object to string for proper rendering
  if (error) return <div>Error fetching POIs: {error.toString()}</div>;

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        {pois.map(poi => (
          <MarkerF
            key={poi.id}
            position={{ lat: poi.latitude || 0, lng: poi.longitude || 0 }}
            icon={{
              url: getMarkerIcon(poi.category),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            onClick={() => handleMarkerClick(poi)}
          />
        ))}
        
        {infoWindow.isOpen && infoWindow.position && (
          <InfoWindowF
            position={infoWindow.position}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              {infoWindow.content}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    );
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Points of Interest</h1>
      {isLoading ? (
        <Skeleton className="w-full h-[600px]" />
      ) : isLoaded ? (
        renderMap()
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PointsOfInterest;
