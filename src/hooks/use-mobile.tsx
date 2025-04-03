
import { useMediaQuery } from 'react-responsive';

export const useMobile = () => {
  return useMediaQuery({ maxWidth: 768 });
};

export default useMobile;
