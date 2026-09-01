import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../store';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export const FavoriteButton = ({ listingId, className = '' }: FavoriteButtonProps) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(listingId));
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(listingId);
    } else {
      addFavorite(listingId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      } ${className}`}
      aria-label="Toggle favorite"
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
};
