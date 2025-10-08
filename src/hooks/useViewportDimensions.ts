import { useEffect, useState } from 'react';
import { useIsMobile } from './useIsMobile';

/**
 * Hook to track viewport dimensions and calculate optimal image sizing
 */
export function useViewportDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateDimensions = () => {
      const baseHeight = window.innerHeight;
      const adjustedHeight = isMobile ? Math.max(baseHeight - 20, 300) : baseHeight;
      setDimensions({
        width: window.innerWidth,
        height: adjustedHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [isMobile]);

  return dimensions;
}
