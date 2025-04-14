
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
const libraries = ['maps', 'marker'] as Libraries; 

// Create the provider component
export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use optional chaining and provide a fallback empty string
  const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Check if API key is present
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is missing!");
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>Configuration Error</h2>
        <p>Google Maps API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.</p>
      </div>
    );
  }

  // Use the hook with the API key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLoaded,
    loadError,
  }), [isLoaded, loadError]);

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
