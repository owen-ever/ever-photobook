import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to manage auto-scroll functionality
 */
export function useAutoScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isEnabled: boolean,
  intervalMs: number,
  totalSlides: number,
  activeIndex: number,
) {
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const slideHeight = container.clientHeight;
      container.scrollTo({
        top: index * slideHeight,
        behavior: 'smooth',
      });
    },
    [containerRef],
  );

  useEffect(() => {
    if (!isEnabled || totalSlides <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      scrollToIndex(nextIndex);
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, intervalMs, totalSlides, activeIndex, scrollToIndex]);

  return { scrollToIndex };
}
