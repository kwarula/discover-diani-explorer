import React, { createContext, useContext, useMemo } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';

// Define the shape of the context data
interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError: Error | undefined;
}

// Create the context with a default value (or undefined)
const GoogleMapsContext = createContext<GoogleMapsContextValue | undefined>(undefined);

// Define the libraries needed across the application
// Combine libraries needed by InteractiveMap (marker) and potentially others (maps)
const libraries = ['maps', 'marker'] as Libraries; 
const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '';

// Create the provider component
export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Consistent ID
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries, // Use the combined libraries
  });

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLoaded,
    loadError,
  }), [isLoaded, loadError]);

  // Basic check for API key presence
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is missing!");
    // Optionally render an error message or fallback UI for the whole app section
    return (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
            Error: Google Maps API Key is missing. Maps functionality will be disabled.
        </div>
    );
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useGoogleMaps = (): GoogleMapsContextValue => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};
