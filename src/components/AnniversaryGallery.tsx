'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useViewportDimensions } from '@/hooks/useViewportDimensions';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { calculateImageDimensions as calcDims } from '@/lib/image';

// ============================================================================
// CUSTOMIZATION CONSTANTS
// ============================================================================
const D_PLUS_INCREMENT_FACTOR = 3; // Subtle D+ animation strength (2-4 recommended)
const LONG_PRESS_THRESHOLD_MS = 400; // Long press detection threshold
const SHOW_INDICATORS = false; // Toggle slide indicators

interface AnniversaryGalleryProps {
  anniversaryDate: string; // Format: "YYYY-MM-DD"
  images: string[];
  autoScrollIntervalMs?: number;
  doubleSpeedFactor?: number;
}
const AnniversaryGallery = ({
  anniversaryDate,
  images,
  autoScrollIntervalMs = 1500,
  doubleSpeedFactor = 0.5,
}: AnniversaryGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [isDoubleSpeed, setIsDoubleSpeed] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [daysCount, setDaysCount] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<{ [key: number]: { width: number; height: number } }>({});

  const longPressTimerRef = useRef<NodeJS.Timeout>(null);
  const pointerDownTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout>(null);

  // Calculate D+ days
  useEffect(() => {
    try {
      const anniversary = new Date(anniversaryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      anniversary.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - anniversary.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      setDaysCount(diffDays);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse anniversary date:', error);
      setDaysCount(null);
    }
  }, [anniversaryDate]);

  const { progress, activeIndex } = useScrollProgress(containerRef, images.length);
  const { width: viewportWidth, height: viewportHeight } = useViewportDimensions();
  const isMobile = useIsMobile();

  // Calculate display value with subtle increment
  const displayDays = daysCount !== null ? daysCount + Math.floor(progress * D_PLUS_INCREMENT_FACTOR) : null;

  // Calculate optimal image dimensions based on viewport and image aspect ratio
  const calculateImageDimensions = useCallback(
    (imgWidth: number, imgHeight: number, viewportW: number, viewportH: number) =>
      calcDims(imgWidth, imgHeight, viewportW, viewportH),
    [],
  );

  // Handle image load to get natural dimensions
  const handleImageLoad = useCallback(
    (index: number, event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;

      // Store original dimensions
      setOriginalImageDimensions(prev => ({
        ...prev,
        [index]: { width: img.naturalWidth, height: img.naturalHeight },
      }));

      // Only calculate display dimensions if viewport is available
      if (viewportWidth > 0 && viewportHeight > 0) {
        const dimensions = calculateImageDimensions(img.naturalWidth, img.naturalHeight, viewportWidth, viewportHeight);
        setImageDimensions(prev => ({ ...prev, [index]: dimensions }));
      }
    },
    [calculateImageDimensions, viewportWidth, viewportHeight],
  );

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

  // Lazy load images near current index
  useEffect(() => {
    const toLoad = new Set(loadedImages);
    toLoad.add(activeIndex);
    if (activeIndex > 0) toLoad.add(activeIndex - 1);
    if (activeIndex < images.length - 1) toLoad.add(activeIndex + 1);

    if (toLoad.size !== loadedImages.size) {
      setLoadedImages(toLoad);
    }
  }, [activeIndex, images.length, loadedImages]);

  // Ensure first image is loaded when viewport is ready
  useEffect(() => {
    if (viewportWidth > 0 && viewportHeight > 0 && images.length > 0) {
      setLoadedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(0);
        return newSet;
      });
    }
  }, [viewportWidth, viewportHeight, images.length]);

  // Gesture handlers
  const handlePointerDown = () => {
    pointerDownTimeRef.current = Date.now();

    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
    }, LONG_PRESS_THRESHOLD_MS);
  };

  const handlePointerUp = () => {
    const pressDuration = Date.now() - pointerDownTimeRef.current;

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (isLongPressing) {
      setIsLongPressing(false);
    } else if (pressDuration < LONG_PRESS_THRESHOLD_MS) {
      // Tap detected - handle click logic
      clickCountRef.current += 1;

      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      clickTimerRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // Single click - toggle auto-scroll
          setIsAutoScrollEnabled(prev => !prev);
          setIsDoubleSpeed(false);
        } else if (clickCountRef.current === 2) {
          // Double click - enable double speed auto-scroll
          setIsAutoScrollEnabled(true);
          setIsDoubleSpeed(true);
        }

        clickCountRef.current = 0;
      }, 300); // 300ms window for double click detection
    }
  };

  const handlePointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && activeIndex < images.length - 1) {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowUp' && activeIndex > 0) {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  // Store original image dimensions for recalculation
  const [originalImageDimensions, setOriginalImageDimensions] = useState<{
    [key: number]: { width: number; height: number };
  }>({});

  // Calculate image dimensions when viewport becomes available
  useEffect(() => {
    if (viewportWidth > 0 && viewportHeight > 0 && Object.keys(originalImageDimensions).length > 0) {
      const newDimensions: { [key: number]: { width: number; height: number } } = {};

      Object.entries(originalImageDimensions).forEach(([index, originalDimensions]) => {
        const imgIndex = parseInt(index);
        if (loadedImages.has(imgIndex)) {
          const recalculatedDimensions = calculateImageDimensions(
            originalDimensions.width,
            originalDimensions.height,
            viewportWidth,
            viewportHeight,
          );
          newDimensions[imgIndex] = recalculatedDimensions;
        }
      });

      if (Object.keys(newDimensions).length > 0) {
        setImageDimensions(prev => ({ ...prev, ...newDimensions }));
      }
    }
  }, [viewportWidth, viewportHeight, calculateImageDimensions, originalImageDimensions, loadedImages]);

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
      <motion.div
        key={displayDays}
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-4 right-4 z-50 rounded-full border border-white/60 bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <span className="text-sm font-light tracking-tight text-neutral-700">
          {displayDays !== null ? `D+${displayDays + 1}` : 'D+—'}
        </span>
      </motion.div>

      {/* Auto-scroll indicator */}
      <AnimatePresence>
        {isAutoScrollEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <Play className="h-3 w-3 text-neutral-600" fill="currentColor" />
            {(isLongPressing || isDoubleSpeed) && (
              <span className="text-xs font-light tracking-tight text-neutral-600">2x</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
        {images.map((src, index) => {
          const dimensions = imageDimensions[index];
          const imageStyle = dimensions
            ? {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
              }
            : {};

          return (
            <div
              key={index}
              className={`relative flex ${isMobile ? 'h-[calc(100vh-40px)]' : 'h-screen'} w-full snap-start snap-always items-center justify-center`}>
              {loadedImages.has(index) ? (
                <motion.img
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className={dimensions ? 'object-contain' : 'max-h-full max-w-full object-contain'}
                  style={imageStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  loading="lazy"
                  onLoad={e => handleImageLoad(index, e)}
                />
              ) : (
                <div className="h-full w-full bg-neutral-100" />
              )}
            </div>
          );
        })}
      </div>

      {/* Slide Indicators */}
      {SHOW_INDICATORS && images.length > 1 && (
        <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2">
          {images.length <= 10 ? (
            <div className="flex gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-6 bg-white/80' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden styles for scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AnniversaryGallery;
