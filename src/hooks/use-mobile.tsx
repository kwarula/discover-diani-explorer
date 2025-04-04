
import { useMediaQuery } from 'react-responsive';

// Export the useMediaQuery hook for backward compatibility
export const useMedia = useMediaQuery;

// Export a convenience hook for mobile detection
export const useMobile = () => {
  return useMediaQuery({ query: '(max-width: 768px)' });
};

// Alias for consistency with sidebar component naming
export const useIsMobile = useMobile;

export default useMobile;
