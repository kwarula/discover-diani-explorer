
import { useMediaQuery } from 'react-responsive';

// Re-export the hook under a different name for backward compatibility
export const useMedia = useMediaQuery;

// Default mobile check
export const useMobile = () => {
  return useMediaQuery({ query: '(max-width: 768px)' });
};

export default useMobile;
