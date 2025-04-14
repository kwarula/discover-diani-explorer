
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, display a placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-gray-100 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
        <div className="aspect-w-16 aspect-h-9 md:aspect-w-3 md:aspect-h-2"></div>
      </div>
    );
  }

  // If only one image, don't show carousel controls
  if (images.length === 1) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        <img
          src={images[0]}
          alt="Gallery"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
    );
  }

  return (
    <Carousel
      className={`relative rounded-lg overflow-hidden ${className}`}
      // Fix: Use a proper onSelect handler
      onSelect={(api) => setCurrentIndex(api.selectedScrollSnap())}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-video">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      
      {/* Image counter */}
      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {images.length}
      </div>
    </Carousel>
  );
};

export default ImageGallery;
