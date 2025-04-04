
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images are provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Move to next image
  const nextImage = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  // Move to previous image
  const prevImage = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden group">
      {/* Main Image */}
      <div className="w-full h-full aspect-w-16 aspect-h-9">
        <img
          src={images[activeIndex]}
          alt={`Gallery image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation Controls - only shown if multiple images */}
      {images.length > 1 && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </>
      )}

      {/* Thumbnail Preview (optional for larger galleries) */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-2 flex gap-2 overflow-x-auto opacity-0 group-hover:opacity-100 transition-opacity">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded-sm ${
                index === activeIndex ? 'ring-2 ring-white' : 'opacity-70'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
