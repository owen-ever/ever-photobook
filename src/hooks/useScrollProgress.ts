import { useEffect, useState } from 'react';

/**
 * Hook to track scroll progress and active slide index
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>, totalSlides: number) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const updateProgress = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const currentProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      setProgress(currentProgress);

      // Calculate active index based on scroll position
      const slideHeight = container.clientHeight;
      const index = Math.round(scrollTop / slideHeight);
      setActiveIndex(Math.min(Math.max(0, index), totalSlides - 1));

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, totalSlides]);

  return { progress, activeIndex };
}
