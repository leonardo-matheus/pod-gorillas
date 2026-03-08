import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: Record<string, string>;
  flavors: string[];
  selectedFlavor: string;
  onFlavorChange: (flavor: string) => void;
  productName: string;
}

export default function ImageCarousel({
  images,
  flavors,
  selectedFlavor,
  onFlavorChange,
  productName,
}: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const currentIndex = flavors.indexOf(selectedFlavor);

  const goToIndex = (index: number) => {
    // Infinite loop
    let newIndex = index;
    if (index < 0) newIndex = flavors.length - 1;
    if (index >= flavors.length) newIndex = 0;
    onFlavorChange(flavors[newIndex]);
  };

  const goNext = () => goToIndex(currentIndex + 1);
  const goPrev = () => goToIndex(currentIndex - 1);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.touches[0].clientX);
    const diff = e.touches[0].clientX - touchStart;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);

    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext(); // Swipe left -> next
      } else {
        goPrev(); // Swipe right -> prev
      }
    }
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setTouchEnd(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
    const diff = e.clientX - touchStart;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0);

    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const getImage = (flavor: string) => {
    return images[flavor] || images.default || Object.values(images)[0] || '/products/v400-mix.png';
  };

  return (
    <div className="relative aspect-square bg-dark-900 rounded-3xl overflow-hidden group">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${isDragging ? dragOffset : 0}px)`,
          }}
        >
          <img
            src={getImage(selectedFlavor)}
            alt={`${productName} - ${selectedFlavor}`}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/products/v400-mix.png';
            }}
          />
        </div>

        {/* Swipe hint animation */}
        {flavors.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/50 flex items-center gap-2 animate-pulse">
            <ChevronLeft className="w-4 h-4" />
            Arraste para ver sabores
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Navigation Arrows (desktop) */}
      {flavors.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {flavors.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {flavors.map((flavor, idx) => (
            <button
              key={flavor}
              onClick={() => onFlavorChange(flavor)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-gorilla-500'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              title={flavor}
            />
          ))}
        </div>
      )}

      {/* Current flavor badge */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-white/10">
          {selectedFlavor}
        </span>
      </div>

      {/* Flavor counter */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-xl text-xs text-dark-400 border border-white/10">
          {currentIndex + 1} / {flavors.length}
        </span>
      </div>
    </div>
  );
}
