'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { formatDaysDisplay } from './utils';
import { SHOW_INDICATORS } from './constants';

interface DaysBadgeProps {
  daysCount: number | null;
}

export function DaysBadge({ daysCount }: DaysBadgeProps) {
  const { sign, displayValue } = formatDaysDisplay(daysCount);

  return (
    <motion.div
      key={daysCount}
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-4 right-[calc(50%-90px)] z-50 w-[180px] rounded-full border border-white/60 bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md">
      <span className="flex w-full items-center justify-center text-center text-xl font-light tracking-tight text-neutral-700">
        ❤️ {displayValue !== null ? `D${sign}${displayValue}` : 'D —'} 일 💕
      </span>
    </motion.div>
  );
}

interface AutoScrollIndicatorProps {
  isAutoScrollEnabled: boolean;
  isLongPressing: boolean;
  isDoubleSpeed: boolean;
}

export function AutoScrollIndicator({ isAutoScrollEnabled, isLongPressing, isDoubleSpeed }: AutoScrollIndicatorProps) {
  return (
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
  );
}

interface ImageSlideProps {
  src: string;
  index: number;
  isLoaded: boolean;
  dimensions?: { width: number; height: number };
  isMobile: boolean;
  onLoad: (index: number, event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function ImageSlide({ src, index, isLoaded, dimensions, isMobile, onLoad }: ImageSlideProps) {
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
      {isLoaded ? (
        <motion.img
          src={src}
          alt={`Photo ${index + 1}`}
          className={dimensions ? 'object-contain' : 'max-h-full max-w-full object-contain'}
          style={imageStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
          onLoad={e => onLoad(index, e)}
        />
      ) : (
        <div className="h-full w-full bg-neutral-100" />
      )}
    </div>
  );
}

interface SlideIndicatorsProps {
  images: string[];
  activeIndex: number;
}

export function SlideIndicators({ images, activeIndex }: SlideIndicatorsProps) {
  if (!SHOW_INDICATORS || images.length <= 1) {
    return null;
  }

  return (
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
  );
}
