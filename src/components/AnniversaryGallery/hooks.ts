import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateImageDimensions as calcDims } from '@/lib/image';
import { parseDateFromPath, calculateDaysCount } from './utils';
import { LONG_PRESS_THRESHOLD_MS, DOUBLE_CLICK_WINDOW_MS } from './constants';

/**
 * Hook to calculate and manage days count (D+) based on active image
 */
export function useDaysCount(images: string[], activeIndex: number, anniversaryDate: string): number | null {
  const [daysCount, setDaysCount] = useState<number | null>(null);

  useEffect(() => {
    const currentSrc = images[activeIndex];
    const imageDate = currentSrc ? parseDateFromPath(currentSrc) : null;
    const calculatedDays = calculateDaysCount(imageDate, anniversaryDate);
    setDaysCount(calculatedDays);
  }, [anniversaryDate, images, activeIndex]);

  return daysCount;
}

/**
 * Hook to manage image dimensions based on viewport and natural image size
 */
export function useImageDimensions(
  images: string[],
  viewportWidth: number,
  viewportHeight: number,
  loadedImages: Set<number>,
) {
  const [imageDimensions, setImageDimensions] = useState<{ [key: number]: { width: number; height: number } }>({});
  const [originalImageDimensions, setOriginalImageDimensions] = useState<{
    [key: number]: { width: number; height: number };
  }>({});

  const calculateImageDimensions = useCallback(
    (imgWidth: number, imgHeight: number, viewportW: number, viewportH: number) =>
      calcDims(imgWidth, imgHeight, viewportW, viewportH),
    [],
  );

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

  return { imageDimensions, handleImageLoad };
}

/**
 * Hook to manage lazy loading of images
 */
export function useLazyImageLoading(
  images: string[],
  activeIndex: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

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

  return loadedImages;
}

/**
 * Hook to manage gesture handlers (pointer events, keyboard navigation)
 */
export function useGestureHandlers(
  activeIndex: number,
  imagesLength: number,
  scrollToIndex: (index: number) => void,
  setIsAutoScrollEnabled: (value: boolean | ((prev: boolean) => boolean)) => void,
  setIsDoubleSpeed: (value: boolean | ((prev: boolean) => boolean)) => void,
  setIsLongPressing: (value: boolean) => void,
  isLongPressing: boolean,
) {
  const longPressTimerRef = useRef<NodeJS.Timeout>(null);
  const pointerDownTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout>(null);

  const handlePointerDown = useCallback(() => {
    pointerDownTimeRef.current = Date.now();

    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
    }, LONG_PRESS_THRESHOLD_MS);
  }, [setIsLongPressing]);

  const handlePointerUp = useCallback(() => {
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
      }, DOUBLE_CLICK_WINDOW_MS);
    }
  }, [isLongPressing, setIsAutoScrollEnabled, setIsDoubleSpeed, setIsLongPressing]);

  const handlePointerCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  }, [setIsLongPressing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' && activeIndex < imagesLength - 1) {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp' && activeIndex > 0) {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      }
    },
    [activeIndex, imagesLength, scrollToIndex],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
  };
}
