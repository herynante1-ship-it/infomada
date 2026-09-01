import { X } from 'lucide-react';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div
        className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setShowFullscreen(true)}
      >
        <img
          src={images[selectedIndex]}
          alt={`${title} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="px-3 py-1 bg-white/80 hover:bg-white text-gray-900 rounded text-sm font-medium transition-colors"
            >
              ← Précédent
            </button>
            <span className="flex-1 text-white text-xs text-center">Image {selectedIndex + 1} / {images.length}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="px-3 py-1 bg-white/80 hover:bg-white text-gray-900 rounded text-sm font-medium transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? 'border-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full text-black hover:bg-gray-200 transition-colors z-10"
          >
            <X size={24} />
          </button>
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={images[selectedIndex]}
              alt={`${title} - Full`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={handlePrev}
                className="px-6 py-2 bg-white/80 hover:bg-white text-gray-900 rounded font-medium transition-colors"
              >
                ← Précédent
              </button>
              <span className="text-white">Image {selectedIndex + 1} / {images.length}</span>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-white/80 hover:bg-white text-gray-900 rounded font-medium transition-colors"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
