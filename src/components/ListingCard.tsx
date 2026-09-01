import { formatPrice, getStateLabel, ListingState } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { Link } from 'react-router-dom';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  state: ListingState;
  photo: string;
}

export const ListingCard = ({
  id,
  title,
  price,
  city,
  state,
  photo,
}: ListingCardProps) => {
  const getStateBadgeClass = () => {
    switch (state) {
      case 'neuf':
        return 'badge-neuf';
      case 'occasion-bon-etat':
        return 'badge-occasion';
      case 'pour-pieces':
        return 'badge-pieces';
      default:
        return '';
    }
  };

  return (
    <Link to={`/listing/${id}`}>
      <div className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          <img
            src={photo}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton listingId={id} />
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={getStateBadgeClass()}>{getStateLabel(state)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{title}</h3>
          
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-gray-500">Ar</span>
          </div>

          <p className="text-xs text-gray-600 flex items-center gap-1">
            <span>📍</span> {city}
          </p>
        </div>
      </div>
    </Link>
  );
};
