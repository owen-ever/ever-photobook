'use client';

import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useViewportDimensions } from '@/hooks/useViewportDimensions';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useDaysCount } from './hooks';
import { useImageDimensions } from './hooks';
import { useLazyImageLoading } from './hooks';
import { useGestureHandlers } from './hooks';
import { DaysBadge, AutoScrollIndicator, ImageSlide, SlideIndicators } from './components';

interface AnniversaryGalleryProps {
  anniversaryDate: string; // Format: "YYYY-MM-DD"
  images: string[];
  autoScrollIntervalMs?: number;
  doubleSpeedFactor?: number;
}

export default function AnniversaryGallery({
  anniversaryDate,
  images,
  autoScrollIntervalMs = 1500,
  doubleSpeedFactor = 0.5,
}: AnniversaryGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [isDoubleSpeed, setIsDoubleSpeed] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const { activeIndex } = useScrollProgress(containerRef, images.length);
  const { width: viewportWidth, height: viewportHeight } = useViewportDimensions();
  const isMobile = useIsMobile();

  // Calculate D days based on active image filename date vs anniversaryDate
  const daysCount = useDaysCount(images, activeIndex, anniversaryDate);

  // Manage lazy loading
  const loadedImages = useLazyImageLoading(images, activeIndex, viewportWidth, viewportHeight);

  // Manage image dimensions
  const { imageDimensions, handleImageLoad } = useImageDimensions(images, viewportWidth, viewportHeight, loadedImages);

  // Auto-scroll with speed adjustment
  const currentInterval =
    isLongPressing || isDoubleSpeed ? autoScrollIntervalMs * doubleSpeedFactor : autoScrollIntervalMs;

  const { scrollToIndex } = useAutoScroll(
    containerRef,
    isAutoScrollEnabled,
    currentInterval,
    images.length,
    activeIndex,
  );

  // Gesture handlers
  const { handlePointerDown, handlePointerUp, handlePointerCancel, handleKeyDown } = useGestureHandlers(
    activeIndex,
    images.length,
    scrollToIndex,
    setIsAutoScrollEnabled,
    setIsDoubleSpeed,
    setIsLongPressing,
    isLongPressing,
  );

  // Handle orientation change
  useEffect(() => {
    const handleResize = () => {
      scrollToIndex(activeIndex);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [activeIndex, scrollToIndex]);

  // Show warning if no images
  if (images.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50">
        <div className="px-8 text-center">
          <p className="text-sm tracking-tight text-neutral-400">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 mx-auto max-w-[840px] overflow-hidden bg-neutral-50"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Anniversary photo gallery">
      {/* D+ Badge */}
      <DaysBadge daysCount={daysCount} />

      {/* Auto-scroll indicator */}
      <AutoScrollIndicator
        isAutoScrollEnabled={isAutoScrollEnabled}
        isLongPressing={isLongPressing}
        isDoubleSpeed={isDoubleSpeed}
      />

      {/* Vertical Slider */}
      <div
        ref={containerRef}
        className="h-full w-full max-w-[840px] snap-y snap-mandatory overflow-y-scroll"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
        aria-live="polite"
        aria-atomic="true">
        {images.map((src, index) => (
          <ImageSlide
            key={index}
            src={src}
            index={index}
            isLoaded={loadedImages.has(index)}
            dimensions={imageDimensions[index]}
            isMobile={isMobile}
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      {/* Slide Indicators */}
      <SlideIndicators images={images} activeIndex={activeIndex} />

      {/* Hidden styles for scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
